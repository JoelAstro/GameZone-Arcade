
const { getDB } = require('../database/database');

// GET /gamers - Get all gamers
const getAllGamers = async (req, res) => {
    try {
        const db = getDB();

        const gamers = await db.all(
            'SELECT * FROM gamers ORDER BY id ASC'
        );

        res.status(200).json({
            message: 'Gamers retrieved successfully',
            count: gamers.length,
            data: gamers
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve gamers',
            details: error.message
        });
    }
};

// GET /gamers/:id - Get one gamer
const getGamerById = async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;

        const gamer = await db.get(
            'SELECT * FROM gamers WHERE id = ?',
            [id]
        );

        if (!gamer) {
            return res.status(404).json({
                error: 'Gamer not found'
            });
        }

        res.status(200).json({
            message: 'Gamer retrieved successfully',
            data: gamer
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve gamer',
            details: error.message
        });
    }
};

// POST /gamers - Register a new gamer
const addGamer = async (req, res) => {
    try {
        const db = getDB();
        const { name, email } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || !cleanEmail) {
            return res.status(400).json({
                error: 'Name and email cannot be empty'
            });
        }

        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                error: 'Please provide a valid email address'
            });
        }

        const result = await db.run(
            'INSERT INTO gamers (name, email) VALUES (?, ?)',
            [cleanName, cleanEmail]
        );

        const newGamer = await db.get(
            'SELECT * FROM gamers WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            message: 'Gamer registered successfully',
            data: newGamer
        });

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                error: 'A gamer with this email already exists'
            });
        }

        res.status(500).json({
            error: 'Failed to register gamer',
            details: error.message
        });
    }
};

module.exports = {
    getAllGamers,
    getGamerById,
    addGamer
};
