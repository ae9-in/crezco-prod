const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @desc Get user notifications
// @route GET /api/notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id })
            .populate('actor_id', 'name')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Mark notification as read
// @route PUT /api/notifications/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification && notification.user_id.toString() === req.user._id.toString()) {
            notification.read = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Mark all notifications as read
// @route PUT /api/notifications/mark-all-read
router.put('/mark-all-read', protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { user_id: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
