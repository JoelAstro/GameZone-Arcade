
const { getDB } = require('../database/database');

// GET all bookings with gamer and console names
const getAllBookings = async (req, res) => {
    try {
        const db = getDB();

        const bookings = await db.all(`
            SELECT
                bookings.id,
                bookings.gamer_id,
                gamers.name AS gamer_name,
                bookings.console_id,
                consoles.name AS console_name,
                consoles.platform,
                bookings.status
            FROM bookings
            INNER JOIN gamers ON bookings.gamer_id = gamers.id
            INNER JOIN consoles ON bookings.console_id = consoles.id
            ORDER BY bookings.id ASC
        `);

        res.status(200).json({
            message: 'Bookings retrieved successfully',
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve bookings',
            details: error.message
        });
    }
};

// CREATE a booking
const createBooking = async (req, res) => {
    try {
        const db = getDB();
        const { gamer_id, console_id } = req.body;

        if (
            !Number.isInteger(gamer_id) ||
            !Number.isInteger(console_id) ||
            gamer_id <= 0 ||
            console_id <= 0
        ) {
            return res.status(400).json({
                error: 'Valid gamer_id and console_id are required'
            });
        }

        const gamer = await db.get(
            'SELECT id FROM gamers WHERE id = ?',
            [gamer_id]
        );

        if (!gamer) {
            return res.status(404).json({
                error: 'Gamer not found'
            });
        }

        const consoleData = await db.get(
            'SELECT id FROM consoles WHERE id = ?',
            [console_id]
        );

        if (!consoleData) {
            return res.status(404).json({
                error: 'Console not found'
            });
        }

        const result = await db.run(
            'INSERT INTO bookings (gamer_id, console_id) VALUES (?, ?)',
            [gamer_id, console_id]
        );

        const booking = await db.get(
            'SELECT * FROM bookings WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create booking',
            details: error.message
        });
    }
};

// UPDATE booking status one step forward
const updateBookingStatus = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { status } = req.body;

        const booking = await db.get(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (!booking) {
            return res.status(404).json({
                error: 'Booking not found'
            });
        }

        const nextStatus = {
            pending: 'approved',
            approved: 'done'
        };

        if (nextStatus[booking.status] !== status) {
            return res.status(400).json({
                error: 'Invalid status change'
            });
        }

        await db.run(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        const updatedBooking = await db.get(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        res.status(200).json({
            message: 'Booking status updated successfully',
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update booking status',
            details: error.message
        });
    }
};

module.exports = {
    getAllBookings,
    createBooking,
    updateBookingStatus
};
