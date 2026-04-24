const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { protect: auth } = require('../middleware/auth');

// GET all gigs with filtering and sorting
router.get("/", async (req, res) => {
  try {
    const { category, sortBy, search, type } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    let sortOption = {};
    if (sortBy === "latest") sortOption.createdAt = -1;
    if (sortBy === "stipend") sortOption.stipend = -1;
    if (!sortBy) sortOption.createdAt = -1; // Default to latest

    const gigs = await Gig.find(filter)
        .populate('created_by', 'name email')
        .populate('college_id', 'name')
        .sort(sortOption);

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new gig (Protected)
router.post("/", auth, async (req, res) => {
    try {
        const { college_id, title, description, category, duration, stipend, deadline, location, type } = req.body;
        const newGig = new Gig({
            college_id,
            created_by: req.user._id,
            title,
            description,
            category,
            duration,
            stipend,
            deadline,
            location,
            type
        });
        const savedGig = await newGig.save();
        res.status(201).json(savedGig);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
