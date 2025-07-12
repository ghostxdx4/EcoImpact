const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkAndAwardBadges } = require('../utils/badgeChecker');

router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const result = await checkAndAwardBadges(user);

        res.json({
            username: user.username,
            ecoPoints: user.ecoPoints,
            greenKarma: user.greenKarma,
            badges: user.badges.length > 0 ? user.badges : ['No badges earned yet']
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
