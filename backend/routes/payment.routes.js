const express = require('express');
const { createOrder, verifyPayment, handleWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public webhook route
router.post('/webhook', handleWebhook);

// Protected routes
router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
