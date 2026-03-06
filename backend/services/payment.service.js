const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Order = require('../models/Order');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const { generateQRCode } = require('../utils/qrGenerator');
const { sendBookingConfirmation } = require('../utils/emailSender');

// ─── Easebuzz Config ──────────────────────────────────────────────────────────
const getEasebuzzConfig = () => {
    const key = process.env.EASEBUZZ_KEY;
    const salt = process.env.EASEBUZZ_SALT;
    const env = process.env.EASEBUZZ_ENV || 'test';
    
    if (!key || !salt) {
        console.warn('[Payment] Easebuzz env vars not set.');
        return null;
    }
    
    const baseUrl = env === 'prod' 
        ? 'https://pay.easebuzz.in' 
        : 'https://testpay.easebuzz.in';

    return { key, salt, baseUrl };
};

const generateHash = (data) => {
    return crypto.createHash('sha512').update(data).digest('hex');
};

// ─── Create Easebuzz Order (Initiate Link) ──────────────────────────────────
/**
 * Creates an Easebuzz order and a pending Order document in MongoDB.
 */
exports.createOrder = async (userId, eventId, quantity = 1, userInfo = {}) => {
    const config = getEasebuzzConfig();
    if (!config) throw new ErrorResponse('Payment gateway not configured', 500);

    const event = await Event.findById(eventId);
    if (!event) throw new ErrorResponse('Event not found', 404);
    if (!event.isActive) throw new ErrorResponse('This event is no longer active', 400);
    if (event.availableTickets < quantity) {
        throw new ErrorResponse(`Only ${event.availableTickets} ticket(s) remaining`, 400);
    }

    // Easebuzz requires the amount as a string with exactly two decimal places (rupees)
    const totalRupees = event.price * quantity;
    const amountFloat = Number(totalRupees).toFixed(2);
    
    const txnid = `txnid_${uuidv4().replace(/-/g, '').slice(0, 20)}`;

    const firstname = userInfo.name || 'Detective';
    const email = userInfo.email || 'detective@example.com';
    const phone = userInfo.phone || '9999999999'; 
    const productinfo = 'Prisma Murder Mystery Event Pass';
    
    // Fallback URLs; these are required API params though seamless checkout captures the callback
    const surl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`; 
    const furl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`;

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1...udf10|salt
    const hashString = `${config.key}|${txnid}|${amountFloat}|${productinfo}|${firstname}|${email}|||||||||||${config.salt}`;
    const hash = generateHash(hashString);

    const formData = new URLSearchParams();
    formData.append('key', config.key);
    formData.append('txnid', txnid);
    formData.append('amount', amountFloat);
    formData.append('productinfo', productinfo);
    formData.append('firstname', firstname);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('surl', surl);
    formData.append('furl', furl);
    formData.append('hash', hash);

    let accessKey = null;
    try {
        const response = await axios.post(`${config.baseUrl}/payment/initiateLink`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
        });

        if (response.data && response.data.status === 1) {
            accessKey = response.data.data;
        } else {
            console.error('[Payment] Easebuzz initiate error:', response.data);
            throw new ErrorResponse('Failed to initiate Easebuzz payment', 500);
        }
    } catch (err) {
        console.error('[Payment] Easebuzz Request Error:', err.response?.data || err.message);
        throw new ErrorResponse('Failed to connect to payment gateway', 500);
    }

    // Store in paise to match existing DB expectations, or just store the amount. 
    // Wait, the previous logic did `event.price * quantity * 100` so it's in paise.
    const order = await Order.create({
        user: userId,
        event: eventId,
        quantity,
        totalAmount: totalRupees * 100, 
        orderId: txnid,
        currency: 'INR',
        paymentStatus: 'pending'
    });

    return {
        orderId: txnid,
        access_key: accessKey,
        amount: totalRupees * 100, // return paise to remain compatible with frontend assumptions
        currency: 'INR',
        dbOrderId: order._id,
        eventTitle: event.title,
        quantity
    };
};

// ─── Verify Payment & Fulfill Order ──────────────────────────────────────────
/**
 * Called after Easebuzz checkout succeeds.
 */
exports.verifyPaymentAndFulfill = async (userId, paymentData, userInfo) => {
    const config = getEasebuzzConfig();
    if (!config) throw new ErrorResponse('Payment gateway not configured', 500);

    const {
        txnid,
        easepayid,
        status,
        hash,
        amount,
        productinfo,
        firstname,
        email,
        udf1, udf2, udf3, udf4, udf5, udf6, udf7, udf8, udf9, udf10
    } = paymentData;

    const order = await Order.findOne({ orderId: txnid, user: userId })
        .populate('event')
        .populate('user', 'name email');

    if (!order) throw new ErrorResponse('Order not found', 404);
    if (order.paymentStatus === 'paid') {
        return { success: true, message: 'Already paid', ticketId: order.ticketId };
    }

    // Calculate reverse hash
    // salt|status|udf10|...|udf1|email|firstname|productinfo|amount|txnid|key
    const reverseHashString = `${config.salt}|${status}|${udf10||''}|${udf9||''}|${udf8||''}|${udf7||''}|${udf6||''}|${udf5||''}|${udf4||''}|${udf3||''}|${udf2||''}|${udf1||''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
    const calculatedHash = generateHash(reverseHashString);

    if (calculatedHash !== hash) {
        order.paymentStatus = 'failed';
        await order.save();
        throw new ErrorResponse('Payment hash verification failed', 400);
    }

    if (status !== 'success') {
        order.paymentStatus = 'failed';
        await order.save();
        throw new ErrorResponse(`Payment was not successful. Status: ${status}`, 400);
    }

    // Atomic ticket decrement (prevents overselling)
    const updatedEvent = await Event.findOneAndUpdate(
        { _id: order.event._id, availableTickets: { $gte: order.quantity } },
        { $inc: { availableTickets: -order.quantity } },
        { new: true }
    );

    if (!updatedEvent) {
        order.paymentStatus = 'failed';
        await order.save();
        throw new ErrorResponse(
            'Sorry, tickets sold out while processing your payment. A refund will be initiated.',
            409
        );
    }

    const ticketId = `PMM-${uuidv4().toUpperCase()}`;
    const qrCodeUrl = await generateQRCode(ticketId, order.event._id.toString());

    order.paymentStatus = 'paid';
    order.paymentId = easepayid;
    order.paymentSignature = hash;
    order.ticketId = ticketId;
    order.qrCodeUrl = qrCodeUrl;
    await order.save();

    // Send email
    const recipientEmail = userInfo?.email || order.user?.email;
    const recipientName = userInfo?.name || order.user?.name || 'Detective';

    if (recipientEmail) {
        sendBookingConfirmation({
            toEmail: recipientEmail,
            userName: recipientName,
            event: order.event,
            ticketId,
            qrCodeBase64: qrCodeUrl,
            quantity: order.quantity,
            totalAmount: order.totalAmount
        }).catch((err) => {
            console.error('[Email] Failed to send confirmation email:', err.message);
        });
    }

    return {
        success: true,
        ticketId,
        qrCodeUrl,
        event: {
            title: order.event.title,
            date: order.event.date
        },
        totalAmount: order.totalAmount
    };
};

exports.getMyOrders = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate('event', 'title date image price')
        .sort({ createdAt: -1 });
    return orders;
};

exports.getAllOrders = async () => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('event', 'title date price')
        .sort({ createdAt: -1 });
    return orders;
};

// ─── Webhook Handler ──────────────────────────────────────────
exports.handleWebhook = async (webhookBody) => {
    const config = getEasebuzzConfig();
    if (!config) throw new ErrorResponse('Payment gateway not configured', 500);

    const {
        txnid,
        easepayid,
        status,
        hash,
        amount,
        productinfo,
        firstname,
        email,
        udf1, udf2, udf3, udf4, udf5, udf6, udf7, udf8, udf9, udf10
    } = webhookBody;

    if (!txnid || !hash || status !== 'success') {
        return { received: true, message: 'Ignored or invalid payload' };
    }

    // Verify hash
    const reverseHashString = `${config.salt}|${status}|${udf10||''}|${udf9||''}|${udf8||''}|${udf7||''}|${udf6||''}|${udf5||''}|${udf4||''}|${udf3||''}|${udf2||''}|${udf1||''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${config.key}`;
    const calculatedHash = generateHash(reverseHashString);

    if (calculatedHash !== hash) {
        throw new ErrorResponse('Invalid webhook hash', 400);
    }

    const order = await Order.findOne({ orderId: txnid })
        .populate('event')
        .populate('user', 'name email');

    if (order && order.paymentStatus === 'pending') {
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: order.event._id, availableTickets: { $gte: order.quantity } },
            { $inc: { availableTickets: -order.quantity } },
            { new: true }
        );

        if (updatedEvent) {
            const ticketId = `PMM-${uuidv4().toUpperCase()}`;
            const qrCodeUrl = await generateQRCode(ticketId, order.event._id.toString());

            order.paymentStatus = 'paid';
            order.paymentId = easepayid;
            order.paymentSignature = hash;
            order.ticketId = ticketId;
            order.qrCodeUrl = qrCodeUrl;
            await order.save();

            if (order.user?.email) {
                sendBookingConfirmation({
                    toEmail: order.user.email,
                    userName: order.user.name,
                    event: order.event,
                    ticketId,
                    qrCodeBase64: qrCodeUrl,
                    quantity: order.quantity,
                    totalAmount: order.totalAmount
                }).catch((err) => console.error('[Webhook Email]', err.message));
            }
        }
    }

    return { received: true, message: 'Webhook processed' };
};
