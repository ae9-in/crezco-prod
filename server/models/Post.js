const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
    content: { 
        type: String, 
        required: true 
    },
    media_url: { 
        type: String 
    },
    media_type: { 
        type: String, 
        enum: ['image', 'video', 'none'], 
        default: 'none' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
