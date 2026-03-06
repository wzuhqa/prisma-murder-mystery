const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');

// ─── Create Event ─────────────────────────────────────────────────────────────
exports.createEvent = async (eventData, adminId) => {
    const event = await Event.create({
        ...eventData,
        createdBy: adminId
    });
    return event;
};

// ─── Get All Events ───────────────────────────────────────────────────────────
exports.getAllEvents = async (query = {}) => {
    const filter = { isActive: true };

    // Allow filtering by upcoming events
    if (query.upcoming === 'true') {
        filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter)
        .populate('createdBy', 'name email')
        .sort({ date: 1 });

    return events;
};

// ─── Get Single Event ─────────────────────────────────────────────────────────
exports.getEventById = async (eventId) => {
    const event = await Event.findById(eventId).populate('createdBy', 'name email');

    if (!event) {
        throw new ErrorResponse('Event not found', 404);
    }

    return event;
};

// ─── Update Event ─────────────────────────────────────────────────────────────
exports.updateEvent = async (eventId, updateData) => {
    // Never allow totalTickets to go below the number of already-sold tickets
    const event = await Event.findById(eventId);

    if (!event) {
        throw new ErrorResponse('Event not found', 404);
    }

    // Guard: if updating totalTickets, ensure it's not less than tickets already sold
    if (updateData.totalTickets !== undefined) {
        const soldTickets = event.totalTickets - event.availableTickets;
        if (updateData.totalTickets < soldTickets) {
            throw new ErrorResponse(
                `Cannot reduce total tickets below already sold count (${soldTickets})`,
                400
            );
        }
        // Recalculate availableTickets proportionally
        const diff = updateData.totalTickets - event.totalTickets;
        updateData.availableTickets = event.availableTickets + diff;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    return updatedEvent;
};

// ─── Delete Event (soft-delete) ───────────────────────────────────────────────
exports.deleteEvent = async (eventId) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw new ErrorResponse('Event not found', 404);
    }

    // Soft-delete: mark isActive = false
    event.isActive = false;
    await event.save();

    return { message: 'Event deleted successfully' };
};
