const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const { protect } = require('../middleware/auth');

// @desc Get reels for a college
// @route GET /api/reels/college/:collegeId
router.get('/college/:collegeId', async (req, res) => {
    try {
        const reels = await Reel.find({ college_id: req.params.collegeId })
            .populate('created_by', 'name email')
            .sort({ createdAt: -1 });
        res.json(reels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Create reel
// @route POST /api/reels
router.post('/', protect, async (req, res) => {
    const { college_id, caption, video_url } = req.body;

    if (!college_id || !video_url) {
        return res.status(400).json({ message: 'College ID and video URL are required' });
    }

    try {
        const reel = await Reel.create({
            college_id,
            caption,
            video_url,
            created_by: req.user._id
        });
        res.status(201).json(reel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
