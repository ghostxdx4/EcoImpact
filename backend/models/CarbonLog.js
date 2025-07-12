const mongoose = require('mongoose');
const { Schema } = mongoose;

const CarbonLogSchema = new Schema({
    username: { type: String, required: true, index: true },
    action: { type: String, required: true },
    category: {
        type: String,
        enum: ['transport', 'energy', 'food', 'waste', 'custom'],
        required: true,
    },
    co2Saved: { type: Number, required: true },
    points: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
});

module.exports = mongoose.model('CarbonLog', CarbonLogSchema);
