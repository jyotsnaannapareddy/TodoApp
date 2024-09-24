const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
    const router = require('express').Router();

    // Middleware to verify JWT
    const verifyToken = (req, res, next) => {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(403).send('A token is required for authentication');
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send('Invalid Token');
            }
            req.userId = decoded.id; // Attach user ID to request
            next();
        });
    };

    // Create a new task
    router.post('/', verifyToken, (req, res) => {
        const { title, status } = req.body;
        const taskId = uuidv4(); // Generate a unique task ID

        db.run(`INSERT INTO tasks (id, title, status, user_id) VALUES (?, ?, ?, ?)`, [taskId, title, status, req.userId], function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(201).send({ message: 'Task created successfully' });
        });
    });

    // Get all tasks for the authenticated user
    router.get('/', verifyToken, (req, res) => {
        db.all(`SELECT * FROM tasks WHERE user_id = ?`, [req.userId], (err, tasks) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).send(tasks);
        });
    });

    // Update task status
    router.put('/:id', verifyToken, (req, res) => {
        const { status } = req.body;
        db.run(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, [status, req.params.id, req.userId], function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).send({ message: 'Task updated successfully' });
        });
    });

    // Delete a task
    router.delete('/:id', verifyToken, (req, res) => {
        db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [req.params.id, req.userId], function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).send({ message: 'Task deleted successfully' });
        });
    });

    return router;
};
