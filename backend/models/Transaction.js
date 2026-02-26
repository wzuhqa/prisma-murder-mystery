const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        orderId: {
            type: String,
            required: true, // Razorpay Order ID
            unique: true
        },
        paymentId: {
            type: String, // Razorpay Payment ID, will be updated on callback/webhook
            sparse: true,
            unique: true
        },
        signature: {
            type: String // Razorpay Signature for verification
        },
        amount: {
            type: Number,
            required: true // Stored in paise/cents
        },
        currency: {
            type: String,
            default: 'INR'
        },
        status: {
            type: String,
            enum: ['created', 'paid', 'failed', 'refunded'],
            default: 'created'
        }
    },
    {
        timestamps: true
    }
);

TransactionSchema.index({ orderId: 1 });
TransactionSchema.index({ paymentId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ user: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
