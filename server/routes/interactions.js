const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const { protect } = require('../middleware/auth');

// @desc Toggle like
// @route POST /api/interactions/like
router.post('/like', protect, async (req, res) => {
    const { item_id, item_type } = req.body;

    try {
        const existingLike = await Like.findOne({
            user_id: req.user._id,
            item_id,
            item_type
        });

        if (existingLike) {
            await existingLike.deleteOne();
            res.json({ liked: false });
        } else {
            await Like.create({
                user_id: req.user._id,
                item_id,
                item_type
            });

            // Trigger Notification (simplified)
            // Find owner of item
            let item;
            if (item_type === 'post') {
                item = await Post.findById(item_id);
            } else {
                item = await Reel.findById(item_id);
            }

            if (item && item.created_by.toString() !== req.user._id.toString()) {
                await Notification.create({
                    user_id: item.created_by,
                    actor_id: req.user._id,
                    type: 'like',
                    entity_id: item_id
                });
            }

            res.json({ liked: true });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Add comment
// @route POST /api/interactions/comment
router.post('/comment', protect, async (req, res) => {
    const { item_id, item_type, content } = req.body;

    try {
        const comment = await Comment.create({
            user_id: req.user._id,
            item_id,
            item_type,
            content
        });

        // Trigger Notification
        let item;
        if (item_type === 'post') {
            item = await Post.findById(item_id);
        } else {
            item = await Reel.findById(item_id);
        }

        if (item && item.created_by.toString() !== req.user._id.toString()) {
            await Notification.create({
                user_id: item.created_by,
                actor_id: req.user._id,
                type: 'comment',
                entity_id: item_id
            });
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get like count
// @route GET /api/interactions/likes
router.get('/likes', async (req, res) => {
    const { item_id, item_type } = req.query;
    try {
        const count = await Like.countDocuments({ item_id, item_type });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Check if user has liked
// @route GET /api/interactions/has_liked
router.get('/has_liked', protect, async (req, res) => {
    const { item_id, item_type } = req.query;
    try {
        const existingLike = await Like.findOne({
            user_id: req.user._id,
            item_id,
            item_type
        });
        res.json({ hasLiked: !!existingLike });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
