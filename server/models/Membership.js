const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    college_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College', 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['cc', 'member'], 
        default: 'member' 
    },
    joined_at: { 
        type: Date, 
        default: Date.now 
    }
});

// Compound index to ensure a user can only be in a college once with a specific role (or just once in general)
membershipSchema.index({ user_id: 1, college_id: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
