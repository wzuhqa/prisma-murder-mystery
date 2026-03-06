const express = require('express');

const authRoutes = require('./auth.routes');
const orderRoutes = require('./payment.routes');   // mounted as /orders
const eventRoutes = require('./event.routes');
const passRoutes = require('./pass.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/events', eventRoutes);
router.use('/pass', passRoutes);

module.exports = router;
