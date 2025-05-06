const mongoose = require('mongoose');

const UserOPTVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 5 * 60 * 1000 // 5 minutes
    }
});

// Add index for automatic expiration
UserOPTVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('UserOPTVerification', UserOPTVerificationSchema);