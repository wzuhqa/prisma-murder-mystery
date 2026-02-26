const express = require('express');

const authRoutes = require('./auth.routes');
const paymentRoutes = require('./payment.routes');
const passRoutes = require('./pass.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/pass', passRoutes);

module.exports = router;
