
const express = require('express');
const router = express.Router();

const {
    getAllConsoles,
    getConsoleById,
    addConsole,
    updateConsole,
    deleteConsole
} = require('../controllers/consoleController');

// GET all consoles and search by platform
router.get('/', getAllConsoles);

// GET console by ID
router.get('/:id', getConsoleById);

// POST add a new console
router.post('/', addConsole);

// PUT update console
router.put('/:id', updateConsole);

// DELETE console
router.delete('/:id', deleteConsole);

module.exports = router;
