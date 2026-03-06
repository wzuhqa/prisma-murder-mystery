const eventService = require('../services/event.service');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
    try {
        const events = await eventService.getAllEvents(req.query);
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private / Admin
exports.createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.body, req.user.id);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private / Admin
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete event (soft delete)
// @route   DELETE /api/events/:id
// @access  Private / Admin
exports.deleteEvent = async (req, res, next) => {
    try {
        const result = await eventService.deleteEvent(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};
