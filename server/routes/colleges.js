const express = require('express');
const router = express.Router();
const College = require('../models/College');
const Membership = require('../models/Membership');
const { protect } = require('../middleware/auth');

// @desc Get all colleges
// @route GET /api/colleges
router.get('/', async (req, res) => {
    try {
        const colleges = await College.find().populate('created_by', 'name');
        const collegesWithCount = await Promise.all(colleges.map(async (college) => {
            const membershipCount = await Membership.countDocuments({ college_id: college._id });
            return {
                ...college._doc,
                id: college._id,
                memberships: { length: membershipCount } // Matching the frontend's expected format
            };
        }));
        res.json(collegesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Create college
// @route POST /api/colleges
router.post('/', protect, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'College name is required' });
    }

    try {
        const college = await College.create({
            name,
            created_by: req.user._id
        });

        // Automatically join the creator as CC
        await Membership.create({
            user_id: req.user._id,
            college_id: college._id,
            role: 'cc'
        });

        res.status(201).json(college);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Join college
// @route POST /api/colleges/:id/join
router.post('/:id/join', protect, async (req, res) => {
    const { role } = req.body; // 'member' or 'cc' (if allowed)
    
    try {
        const membership = await Membership.create({
            user_id: req.user._id,
            college_id: req.params.id,
            role: role || 'member'
        });
        res.status(201).json(membership);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Get user role in a college
// @route GET /api/colleges/:id/role
router.get('/:id/role', protect, async (req, res) => {
    try {
        const membership = await Membership.findOne({ 
            user_id: req.user._id, 
            college_id: req.params.id 
        });
        res.json({ role: membership ? membership.role : null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Leave college
// @route DELETE /api/colleges/:id/leave
router.delete('/:id/leave', protect, async (req, res) => {
    try {
        await Membership.findOneAndDelete({ 
            user_id: req.user._id, 
            college_id: req.params.id 
        });
        res.json({ message: 'Left college' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
