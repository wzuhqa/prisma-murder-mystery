const crypto = require('crypto');
const Pass = require('../models/Pass');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.activatePass = async (userId, transactionId) => {
    // Check if user already has an active pass to prevent duplicate purchases if not intended
    const existingPass = await Pass.findOne({ user: userId, status: 'active' });

    if (existingPass) {
        return existingPass;
    }

    // Generate unique passcode (e.g., PAS-XXXX-XXXX)
    const passCode = `PAS-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // You can generate a QR code string or URL here using a library if required.
    // We'll store the code string which the frontend can use to render a QR code.
    const qrCodeData = `mm-pass:${passCode}`;

    const pass = await Pass.create({
        user: userId,
        transaction: transactionId,
        passCode: passCode,
        status: 'active',
        qrCodeUrl: qrCodeData // placeholder for an actual image URL or data
    });

    // Update user model to reflect activated state
    await User.findByIdAndUpdate(userId, { hasActivatedPass: true });

    return pass;
};

exports.getPassForUser = async (userId) => {
    const pass = await Pass.findOne({ user: userId });

    if (!pass) {
        throw new ErrorResponse('No pass found for this user', 404);
    }

    return pass;
};
