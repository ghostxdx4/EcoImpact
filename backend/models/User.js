const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:       { type: String, required: true, unique: true },
    username:    { type: String, required: true },
    password:    { type: String, required: true },          // plaintext for dev only
    ecoPoints:   { type: Number, default: 0 },
    greenKarma:  { type: Number, default: 0 },
    badges:      { type: [String], default: [] },
    createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
