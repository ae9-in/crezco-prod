const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
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
    caption: { 
        type: String 
    },
    video_url: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);
