const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    members: { type: Number, default: 1 },
    greenKarma: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 },
    isJoined: { type: Boolean, default: false },
    avatar: String
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
