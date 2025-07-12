const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['cleanup', 'workshop', 'challenge', 'other'], default: 'other' },
    attendees: { type: Number, default: 0 },
    maxAttendees: { type: Number, required: true },
    organizer: { type: String, required: true },
    image: { type: String },
    impact: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
