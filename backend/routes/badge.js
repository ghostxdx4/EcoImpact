const express = require('express');
const router = express.Router();
const { badgeConditions } = require('../utils/badgeChecker');

router.get('/conditions', (req, res) => {
    // Return badge IDs, names, and description of conditions (omit functions)
    const conditionSummaries = badgeConditions.map(b => ({
        id: b.id,
        name: b.name,
        // Optionally define human-readable condition description in badgeChecker.js
        description: b.description || 'No description'
    }));

    res.json(conditionSummaries);
});

module.exports = router;
