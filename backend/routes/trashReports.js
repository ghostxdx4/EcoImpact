const express = require('express');
const router = express.Router();
const TrashReport = require('../models/TrashReport');

// POST a new trash report
router.post('/', async (req, res) => {
    try {
        const report = new TrashReport(req.body);
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving report' });
    }
});

// GET all trash reports (for admin or map display)
router.get('/', async (req, res) => {
    try {
        const reports = await TrashReport.find();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
});



module.exports = router;
