const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const PassService = require('./pass.service');
const ErrorResponse = require('../utils/errorResponse');

// Initialize Razorpay
// Note: These env vars must be set in .env
let razorpayInstance;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.warn("Razorpay keys not configured. Waiting for env variables.");
            return null;
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

exports.createOrder = async (userId, amount) => {
    const rzp = getRazorpayInstance();
    if (!rzp) throw new ErrorResponse('Payment gateway not configured', 500);

    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_order_${Math.random() * 10000}`,
    };

    try {
        const order = await rzp.orders.create(options);

        // Record the created order in DB
        const transaction = await Transaction.create({
            user: userId,
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            status: 'created'
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            dbTransactionId: transaction._id
        };
    } catch (error) {
        throw new ErrorResponse(error.message || 'Error creating Razorpay order', 500);
    }
};

exports.verifyPaymentAndInitializePass = async (userId, paymentData) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const rzp = getRazorpayInstance();
    if (!rzp) throw new ErrorResponse('Payment gateway not configured', 500);

    // Find transaction
    const transaction = await Transaction.findOne({ orderId: razorpay_order_id, user: userId });

    if (!transaction) {
        throw new ErrorResponse('Transaction not found', 404);
    }

    if (transaction.status === 'paid') {
        return { message: 'Already paid', orderId: razorpay_order_id };
    }

    // Create expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment verified
        transaction.status = 'paid';
        transaction.paymentId = razorpay_payment_id;
        transaction.signature = razorpay_signature;
        await transaction.save();

        // Call PassService to generate and activate pass
        const pass = await PassService.activatePass(userId, transaction._id);

        return { success: true, pass };
    } else {
        transaction.status = 'failed';
        await transaction.save();
        throw new ErrorResponse('Invalid Payment Signature', 400);
    }
};

exports.handleWebhook = async (webhookBody, signature) => {
    // For advanced webhook reconciliation. E.g., handling asynchronous 'payment.captured' events.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(webhookBody))
        .digest('hex');

    if (expectedSignature !== signature) {
        throw new ErrorResponse('Invalid Webhook Signature', 400);
    }

    const event = webhookBody.event;

    if (event === 'payment.captured') {
        const paymentData = webhookBody.payload.payment.entity;
        const orderId = paymentData.order_id;
        const paymentId = paymentData.id;

        const transaction = await Transaction.findOne({ orderId });

        // If webhook reaches before client-side verification
        if (transaction && transaction.status === 'created') {
            transaction.status = 'paid';
            transaction.paymentId = paymentId;
            await transaction.save();

            // Activate pass
            await PassService.activatePass(transaction.user, transaction._id);
        }
    }

    return { received: true };
}
