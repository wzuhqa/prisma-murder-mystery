const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1
        },
        totalAmount: {
            type: Number,
            required: true // in paise (INR smallest unit)
        },
        orderId: {
            type: String,
            required: true, // Easebuzz txnid
            unique: true
        },
        paymentId: {
            type: String, // Easebuzz easepayid — set after verification
            sparse: true,
            unique: true
        },
        paymentSignature: {
            type: String // Easebuzz HMAC signature for audit trail
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        ticketId: {
            type: String,
            unique: true,
            sparse: true // generated after payment verification
        },
        qrCodeUrl: {
            type: String // Base64 PNG data URL of QR code
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    {
        timestamps: true
    }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ event: 1 });
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ paymentId: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ ticketId: 1 });

module.exports = mongoose.model('Order', OrderSchema);
