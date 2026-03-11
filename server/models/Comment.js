const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    item_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    item_type: { 
        type: String, 
        enum: ['post', 'reel'], 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
