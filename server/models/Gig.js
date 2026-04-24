const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    college_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College', 
        required: true 
    },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true // e.g. Marketing, Tech, Event
    },
    duration: { 
        type: String // e.g. "2 weeks", "1 month"
    },
    stipend: { 
        type: Number 
    },
    deadline: { 
        type: Date 
    },
    location: { 
        type: String 
    },
    type: { 
        type: String, // remote / on-campus
        enum: ['remote', 'on-campus'],
        default: 'on-campus'
    }
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);
