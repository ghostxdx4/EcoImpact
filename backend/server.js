const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


// Create app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/EcoImpact', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/carbon-log', require('./routes/carbonLog'));
app.use('/api/reports', require('./routes/trashReports'));
app.use('/api/trash', require('./routes/trashRoutes'));
app.use('/api/events', require('./routes/events'));
app.use('/api/teams', require('./routes/teams'));
const badgeRoutes = require('./routes/badge');
app.use('/api/badges', badgeRoutes);



// Base route
app.get('/', (req, res) => {
    res.send('🌱 EcoImpact Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
