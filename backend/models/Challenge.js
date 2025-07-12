const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    goalCO2: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    endDate: Date,
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
