const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const router = express.Router();

require('dotenv').config();

// Signup route
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('User registered successfully');
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) return res.status(404).send('User not found');
        
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).send('Invalid credentials');
        
        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], function(err) {
        if (err) return res.status(500).send('Error updating profile');
        res.sendStatus(204);
    });
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).send('User not found');
        res.json(user);
    });
});


module.exports = router;
