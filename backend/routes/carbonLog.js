// routes/carbonlog.js
const express  = require('express');
const router   = express.Router();
const CarbonLog = require('../models/CarbonLog');

// CREATE  ──────────────────────────────────────────────────────────
// routes/carbonlog.js
router.post('/', async (req, res) => {
    try {
        const {
            username,
            action,
            category,
            co2Saved,
            points,
            date,
            description,
        } = req.body;

        const newLog = new CarbonLog({
            username,
            action,
            category,
            co2Saved,
            points,
            date,
            description,
        });

        await newLog.save();
        res.status(201).json({ message: 'Log saved successfully', log: newLog });
    } catch (err) {
        console.error('Error saving carbon log:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/:username', async (req, res) => {
    try {
        const logs = await CarbonLog.find({ username: req.params.username }).sort({ date: -1 });
        res.json(logs); // ← return array directly
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.get('/user/:username/summary', async (req, res) => {
    try {
        const username = req.params.username;
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // 1. Totals per category
        const categoryTotals = await CarbonLog.aggregate([
            { $match: { username } },
            { $group: { _id: '$category', total: { $sum: '$co2Saved' } } },
        ]);

        // 2. Weekly total
        const weekly = await CarbonLog.aggregate([
            { $match: { username, date: { $gte: weekAgo } } },
            { $group: { _id: null, total: { $sum: '$co2Saved' } } },
        ]);

        res.json({
            categoryTotals,
            weeklyTotal: weekly[0]?.total || 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
