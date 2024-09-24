const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create and connect to the SQLite database
const db = new sqlite3.Database(path.join(__dirname, '..', 'todoapp.db'), (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create users and tasks tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        }
    });
});

module.exports = db;
