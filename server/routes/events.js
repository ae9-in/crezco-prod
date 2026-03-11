const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// @desc Get events for a college
// @route GET /api/events/college/:collegeId
router.get('/college/:collegeId', async (req, res) => {
    try {
        const events = await Event.find({ college_id: req.params.collegeId })
            .sort({ event_date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Create event
// @route POST /api/events
router.post('/', protect, async (req, res) => {
    const { college_id, title, description, event_date } = req.body;

    if (!college_id || !title || !event_date) {
        return res.status(400).json({ message: 'College ID, title, and date are required' });
    }

    try {
        const event = await Event.create({
            college_id,
            title,
            description,
            event_date,
            created_by: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get upcoming events
// @route GET /api/events/upcoming
router.get('/upcoming', async (req, res) => {
    try {
        const events = await Event.find({ 
            event_date: { $gte: new Date() } 
        })
        .populate('college_id', 'name')
        .sort({ event_date: 1 })
        .limit(4);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
