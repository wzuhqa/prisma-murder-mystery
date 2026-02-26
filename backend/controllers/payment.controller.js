const paymentService = require('../services/payment.service');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, error: 'Amount is required' });
        }

        const orderData = await paymentService.createOrder(req.user.id, amount);

        res.status(200).json({
            success: true,
            data: orderData
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify Razorpay Payment Signature (Client-side trigger)
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const result = await paymentService.verifyPaymentAndInitializePass(req.user.id, req.body);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// @desc    Razorpay Webhook Endpoint
// @route   POST /api/payment/webhook
// @access  Public
exports.handleWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-razorpay-signature'];

        if (!signature) {
            return res.status(400).json({ success: false, error: 'Signature missing' });
        }

        const result = await paymentService.handleWebhook(req.body, signature);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
