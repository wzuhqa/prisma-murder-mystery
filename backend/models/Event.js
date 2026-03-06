const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add an event title'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters']
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters']
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: [0, 'Price cannot be negative'],
            default: 1000
        },
        date: {
            type: Date,
            required: [true, 'Please add an event date']
        },
        totalTickets: {
            type: Number,
            required: [true, 'Please add total ticket count'],
            min: [1, 'Must have at least 1 ticket']
        },
        availableTickets: {
            type: Number,
            min: [0, 'Available tickets cannot be negative']
        },
        image: {
            type: String,
            default: ''
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Auto-set availableTickets to totalTickets on create if not supplied
EventSchema.pre('save', function (next) {
    if (this.isNew && this.availableTickets === undefined) {
        this.availableTickets = this.totalTickets;
    }
    next();
});

EventSchema.index({ date: 1 });
EventSchema.index({ isActive: 1 });
EventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', EventSchema);
