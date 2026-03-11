const express = require('express');
const router = express.Router();
const User = require('../models/User');
const College = require('../models/College');
const Event = require('../models/Event');

// @desc Get top coordinators
// @route GET /api/leaderboard/coordinators
router.get('/coordinators', async (req, res) => {
    try {
        // This is a bit complex for a simple aggregation, but let's do it
        const coordinators = await User.find({ role: 'cc' }).limit(10);
        const ranked = await Promise.all(coordinators.map(async (u) => {
            const eventCount = await Event.countDocuments({ created_by: u._id });
            return {
                id: u._id,
                name: u.name,
                eventCount
            };
        }));
        res.json(ranked.sort((a, b) => b.eventCount - a.eventCount));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get top colleges
// @route GET /api/leaderboard/colleges
router.get('/colleges', async (req, res) => {
    try {
        const colleges = await College.find().limit(10);
        const ranked = await Promise.all(colleges.map(async (c) => {
            const eventCount = await Event.countDocuments({ college_id: c._id });
            return {
                id: c._id,
                name: c.name,
                eventCount
            };
        }));
        res.json(ranked.sort((a, b) => b.eventCount - a.eventCount));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
