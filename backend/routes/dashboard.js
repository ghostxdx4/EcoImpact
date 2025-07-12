const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CarbonLog = require('../models/CarbonLog');
const TrashReport = require('../models/TrashReport');
const Team = require('../models/Team');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        const carbonLogs = await CarbonLog.find({ userId });
        const trashReports = await TrashReport.find({ userId });
        const team = await Team.findOne({ members: userId });

        res.json({ user, carbonLogs, trashReports, team });
    } catch (error) {
        console.error('Dashboard fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
