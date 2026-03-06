const express = require('express');
const {
    createOrder,
    verifyPayment,
    getMyOrders,
    getAllOrders,
    handleWebhook
} = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');

const router = express.Router();

// ─── Webhook (public, raw body needed for signature verification) ─────────────
// NOTE: The raw body parsing for this route is applied in server.js BEFORE the
//       global express.json() middleware, so req.body here is already the raw Buffer
//       that gets passed as-is to the service.
router.post('/webhook', handleWebhook);

// ─── Protected user routes ─────────────────────────────────────────────────────
router.use(protect);

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/my-orders', getMyOrders);

// ─── Admin route ───────────────────────────────────────────────────────────────
router.get('/all', authorize('admin'), getAllOrders);

module.exports = router;
