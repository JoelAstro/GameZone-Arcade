
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

// Connect to SQLite database
async function connectDB() {
    try {
        db = await open({
            filename: path.join(__dirname, '..', 'gamezone.db'),
            driver: sqlite3.Database
        });

        // Enable foreign key support
        await db.exec('PRAGMA foreign_keys = ON');

        // Create Gamers table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS gamers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
        `);

        // Create Consoles table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS consoles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                platform TEXT NOT NULL
            )
        `);

        // Create Bookings table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gamer_id INTEGER NOT NULL,
                console_id INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'approved', 'done')),

                FOREIGN KEY (gamer_id) REFERENCES gamers(id),
                FOREIGN KEY (console_id) REFERENCES consoles(id)
            )
        `);

        console.log('Database connected successfully!');
        console.log('All three tables created successfully!');

        return db;

    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

// Export database connection
function getDB() {
    if (!db) {
        throw new Error('Database is not initialized');
    }

    return db;
}

module.exports = { connectDB, getDB };
