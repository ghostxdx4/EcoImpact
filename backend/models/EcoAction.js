const mongoose = require('mongoose');

const EcoActionSchema = new mongoose.Schema({
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category:    { type: String, enum: ['transport','energy','food','waste'], required: true },
    action:      { type: String, required: true },
    co2Saved:    { type: Number, required: true },          // kg
    points:      { type: Number, required: true },          // = co2Saved * 10
    description: { type: String },
    date:        { type: Date,   default: Date.now }
});

module.exports = mongoose.model('EcoAction', EcoActionSchema);
