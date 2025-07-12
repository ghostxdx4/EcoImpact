const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// GET all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create new team
router.post('/', async (req, res) => {
    const team = new Team({
        name: req.body.name,
        description: req.body.description,
        avatar: req.body.avatar,
        members: 1, // default
        greenKarma: 0, // default
        co2Saved: 0, // default
        isJoined: false
    });
    try {
        const newTeam = await team.save();
        res.status(201).json(newTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
