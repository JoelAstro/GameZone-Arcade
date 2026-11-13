
const { getDB } = require('../database/database');

// GET all consoles (with optional platform search)
const getAllConsoles = async (req, res) => {
    try {
        const db = getDB();
        const { platform } = req.query;

        let consoles;

        if (platform) {
            consoles = await db.all(
                'SELECT * FROM consoles WHERE platform LIKE ? ORDER BY id ASC',
                [`%${platform}%`]
            );
        } else {
            consoles = await db.all(
                'SELECT * FROM consoles ORDER BY id ASC'
            );
        }

        res.status(200).json({
            message: 'Consoles retrieved successfully',
            count: consoles.length,
            data: consoles
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve consoles',
            details: error.message
        });
    }
};

// GET console by ID
const getConsoleById = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;

        const consoleData = await db.get(
            'SELECT * FROM consoles WHERE id = ?',
            [id]
        );

        if (!consoleData) {
            return res.status(404).json({
                error: 'Console not found'
            });
        }

        res.status(200).json({
            message: 'Console retrieved successfully',
            data: consoleData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve console',
            details: error.message
        });
    }
};

// POST add console
const addConsole = async (req, res) => {
    try {
        const db = getDB();
        const { name, platform } = req.body;

        if (
            typeof name !== 'string' ||
            typeof platform !== 'string' ||
            !name.trim() ||
            !platform.trim()
        ) {
            return res.status(400).json({
                error: 'Name and platform are required'
            });
        }

        const result = await db.run(
            'INSERT INTO consoles (name, platform) VALUES (?, ?)',
            [name.trim(), platform.trim()]
        );

        const newConsole = await db.get(
            'SELECT * FROM consoles WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            message: 'Console added successfully',
            data: newConsole
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to add console',
            details: error.message
        });
    }
};

// PUT update console
const updateConsole = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { name, platform } = req.body;

        if (
            typeof name !== 'string' ||
            typeof platform !== 'string' ||
            !name.trim() ||
            !platform.trim()
        ) {
            return res.status(400).json({
                error: 'Name and platform are required'
            });
        }

        const existingConsole = await db.get(
            'SELECT * FROM consoles WHERE id = ?',
            [id]
        );

        if (!existingConsole) {
            return res.status(404).json({
                error: 'Console not found'
            });
        }

        await db.run(
            'UPDATE consoles SET name = ?, platform = ? WHERE id = ?',
            [name.trim(), platform.trim(), id]
        );

        const updatedConsole = await db.get(
            'SELECT * FROM consoles WHERE id = ?',
            [id]
        );

        res.status(200).json({
            message: 'Console updated successfully',
            data: updatedConsole
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update console',
            details: error.message
        });
    }
};

// DELETE console
const deleteConsole = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;

        const existingConsole = await db.get(
            'SELECT * FROM consoles WHERE id = ?',
            [id]
        );

        if (!existingConsole) {
            return res.status(404).json({
                error: 'Console not found'
            });
        }

        await db.run(
            'DELETE FROM consoles WHERE id = ?',
            [id]
        );

        res.status(200).json({
            message: 'Console deleted successfully'
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                error: 'Cannot delete a console that has existing bookings'
            });
        }

        res.status(500).json({
            error: 'Failed to delete console',
            details: error.message
        });
    }
};

module.exports = {
    getAllConsoles,
    getConsoleById,
    addConsole,
    updateConsole,
    deleteConsole
};
