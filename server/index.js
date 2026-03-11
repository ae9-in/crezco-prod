require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reels', require('./routes/reels'));
app.use('/api/interactions', require('./routes/interactions'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/api/metrics', async (req, res) => {
    try {
        const [users, colleges, events, posts] = await Promise.all([
            require('./models/User').countDocuments(),
            require('./models/College').countDocuments(),
            require('./models/Event').countDocuments(),
            require('./models/Post').countDocuments()
        ]);
        res.json({ users, colleges, events, posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('CREZCO API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
