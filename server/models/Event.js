const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
        type: String 
    },
    event_date: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
