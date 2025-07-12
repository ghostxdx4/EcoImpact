const badgeConditions = [
    {
        id: 'eco-warrior',
        name: 'Eco Warrior',
        condition: (user) => user.ecoPoints >= 100
    },
{
    id: 'carbon-crusher',
    name: 'Carbon Crusher',
    condition: (user) => user.greenKarma >= 50
},
{
    id: 'trash-hunter',
    name: 'Trash Hunter',
    condition: (user) => user.badges.includes('trash-hunter')
},
{
    id: 'team-player',
    name: 'Team Player',
    condition: (user) => user.badges.includes('team-player')
},
{
    id: 'green-champion',
    name: 'Green Champion',
    condition: (user) => user.ecoPoints >= 500
},
{
    id: 'eco-legend',
    name: 'Eco Legend',
    condition: (user) => user.ecoPoints >= 1000 && user.greenKarma >= 500
},
];

const checkAndAwardBadges = async (user) => {
    const newlyEarned = [];

    for (const badge of badgeConditions) {
        if (badge.condition(user) && !user.badges.includes(badge.id)) {
            user.badges.push(badge.id);
            newlyEarned.push(badge.id);
        }
    }

    if (newlyEarned.length > 0) {
        await user.save();
    }

    return { user, newlyEarned };
};

module.exports = { badgeConditions, checkAndAwardBadges };
