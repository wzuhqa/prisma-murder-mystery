const paymentService = require('../services/payment.service');

// @desc    Create Easebuzz Order
// @route   POST /api/orders/create
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { eventId, quantity } = req.body;

        if (!eventId) {
            return res.status(400).json({ success: false, error: 'eventId is required' });
        }

        const orderData = await paymentService.createOrder(
            req.user.id,
            eventId,
            quantity || 1,
            { name: req.user.name, email: req.user.email, phone: req.user.phone || '9999999999' }
        );

        res.status(200).json({ success: true, data: orderData });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify Easebuzz Payment Signature + Fulfill Order
// @route   POST /api/orders/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const paymentData = req.body;

        if (!paymentData.txnid || !paymentData.hash || !paymentData.status) {
            return res.status(400).json({
                success: false,
                error: 'txnid, hash, and status are required for Easebuzz verification'
            });
        }

        const result = await paymentService.verifyPaymentAndFulfill(
            req.user.id,
            req.body,
            { email: req.user.email, name: req.user.name }
        );

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await paymentService.getMyOrders(req.user.id);
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders (admin dashboard)
// @route   GET /api/orders/all
// @access  Private / Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await paymentService.getAllOrders();
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

// @desc    Easebuzz Webhook
// @route   POST /api/orders/webhook
// @access  Public (verified via HMAC signature)
exports.handleWebhook = async (req, res, next) => {
    try {
        const result = await paymentService.handleWebhook(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
