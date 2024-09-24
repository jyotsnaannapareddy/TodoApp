const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
    const router = require('express').Router();

    // User Registration
    router.post('/signup', (req, res) => {
        const { name, email, password } = req.body;
        const userId = uuidv4(); // Generate a unique user ID

        // Save user to the database using UUID
        db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, [userId, name, email, password], function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(201).send({ message: 'User registered successfully' });
        });
    });

    // User Login
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
            if (err || !user) {
                return res.status(401).send('Invalid email or password');
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ token });
        });
    });

    return router;
};
