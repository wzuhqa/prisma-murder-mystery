const mongoose = require('mongoose');

const PassSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        },
        passCode: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ['active', 'used', 'revoked'],
            default: 'active'
        },
        qrCodeUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

PassSchema.index({ user: 1 });
PassSchema.index({ passCode: 1 });
PassSchema.index({ status: 1 });

module.exports = mongoose.model('Pass', PassSchema);
