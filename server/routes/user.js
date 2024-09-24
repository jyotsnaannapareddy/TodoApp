const express = require('express');
const verifyToken = require('../middleware/auth'); // Import JWT verification middleware
const db = require('../db/db');
const router = express.Router();

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
    const { name, email } = req.body;
    const userId = req.userId; // `req.userId` comes from the verifyToken middleware

    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], function(err) {
        if (err) return res.status(500).send('Error updating profile');
        res.sendStatus(204);
    });
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
    const userId = req.userId; // `req.userId` comes from the verifyToken middleware

    db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).send('User not found');
        res.json(user);
    });
});

module.exports = router;
