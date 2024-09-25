const express = require('express');
const verifyToken = require('../middleware/auth'); // Import JWT verification middleware
const db = require('../db/db');
const router = express.Router();

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
    const { name, email } = req.body;
    const userId = req.userId; // `req.userId` comes from the verifyToken middleware

    // Check if name or email is missing
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }

    // Update user in the database
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], function(err) {
        if (err) {
            console.error('Error updating profile:', err); // Log the error
            return res.status(500).send('Error updating profile');
        }
        res.sendStatus(204); // Successfully updated
    });
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
    const userId = req.userId; // `req.userId` comes from the verifyToken middleware

    db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            console.error('Error fetching user profile:', err); // Log the error
            return res.status(404).send('User not found');
        }
        res.json(user); // Return the user data as JSON
    });
});


router.post('/reset-password', verifyToken, async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.userId; // `req.userId` comes from the verifyToken middleware

    // Check if newPassword is provided
    if (!newPassword) {
        return res.status(400).send('New password is required');
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
            if (err) {
                console.error('Error resetting password:', err); // Log the error
                return res.status(500).send('Error resetting password');
            }
            res.sendStatus(204); // Successfully updated
        });
    } catch (error) {
        console.error('Error hashing password:', error); // Log the error
        return res.status(500).send('Error resetting password');
    }
});

module.exports = router;
