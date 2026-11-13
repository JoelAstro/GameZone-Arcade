
const express = require('express');
const router = express.Router();

const {
    getAllBookings,
    createBooking,
    updateBookingStatus
} = require('../controllers/bookingController');

// GET all bookings
router.get('/', getAllBookings);

// POST create booking
router.post('/', createBooking);

// PATCH update booking status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
