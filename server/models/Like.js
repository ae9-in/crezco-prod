const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

likeSchema.index({ user_id: 1, item_id: 1, item_type: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
