const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new event
router.post('/', async (req, res) => {
    const { title, description, date, location, type, attendees, maxAttendees, organizer, image } = req.body;

    if (!title || !description || !date || !location || !maxAttendees || !organizer) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            type,
            attendees,
            maxAttendees,
            organizer,
            image
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
