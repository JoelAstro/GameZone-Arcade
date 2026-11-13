
const express = require('express');
const { connectDB } = require('./database/database');

// Import route files
const gamerRoutes = require('./routes/gamerRoutes');
const consoleRoutes = require('./routes/consoleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to GameZone Arcade API!',
        status: 'Server is running'
    });
});

// Gamer routes
app.use('/gamers', gamerRoutes);

// Console routes
app.use('/consoles', consoleRoutes);

// Booking routes
app.use('/bookings', bookingRoutes);

// Start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`GameZone Arcade server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
