const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Membership = require('../models/Membership');
const { protect } = require('../middleware/auth');

// @desc Get posts for a college
// @route GET /api/posts/college/:collegeId
router.get('/college/:collegeId', async (req, res) => {
    try {
        const posts = await Post.find({ college_id: req.params.collegeId })
            .populate('created_by', 'name email')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get global feed
// @route GET /api/posts/global
router.get('/global', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('created_by', 'name email')
            .populate('college_id', 'name')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Create post
// @route POST /api/posts
router.post('/', protect, async (req, res) => {
    const { college_id, content, media_url, media_type } = req.body;

    if (!college_id || !content) {
        return res.status(400).json({ message: 'College ID and content are required' });
    }

    try {
        const post = await Post.create({
            college_id,
            content,
            media_url,
            media_type: media_type || 'none',
            created_by: req.user._id
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get community feed (posts from colleges user is a member of)
// @route GET /api/posts/community
router.get('/community', protect, async (req, res) => {
    try {
        const memberships = await Membership.find({ user_id: req.user._id });
        const collegeIds = memberships.map(m => m.college_id);

        const posts = await Post.find({ college_id: { $in: collegeIds } })
            .populate('created_by', 'name email')
            .populate('college_id', 'name')
            .sort({ createdAt: -1 })
            .limit(30);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
