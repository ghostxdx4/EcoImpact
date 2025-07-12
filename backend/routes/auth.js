const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const newUser = new User({
            email,
            username,
            password,
            ecoPoints: 1250,
            greenKarma: 3480,
            badges: []
        });

        await newUser.save();

        res.status(201).json({ message: "User registered", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password }); // ⚠️ plaintext check
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
