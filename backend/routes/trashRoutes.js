const express = require('express');
const router = express.Router();
const TrashReport = require('../models/TrashReport');

// GET all trash reports
router.get('/', async (req, res) => {
    try {
        const reports = await TrashReport.find();
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
