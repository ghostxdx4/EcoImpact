const EcoAction = require('../models/EcoAction');
const User      = require('../models/User');

const BADGES = {
    'Eco Warrior'    : user => EcoAction.countDocuments({ user }).then(c => c >= 10),
    'Carbon Crusher' : user => EcoAction.aggregate([
        { $match:{ user } },
        { $group:{ _id:null, total:{ $sum:'$co2Saved' } } }
    ]).then(r => (r[0]?.total || 0) >= 100),
    'Green Champion' : userId => User.findById(userId).then(u => u.greenKarma >= 500),
    // add more here…
};

async function checkAndAward(userId) {
    const user = await User.findById(userId);
    if (!user) return;

    for (const [badge, test] of Object.entries(BADGES)) {
        if (!user.badges.includes(badge) && await test(userId)) {
            user.badges.push(badge);
            console.log(`🏅  User ${user.username} earned “${badge}”`);
        }
    }
    await user.save();
}

module.exports = { checkAndAward };
