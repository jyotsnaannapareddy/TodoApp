    const jwt = require('jsonwebtoken');
    const { v4: uuidv4 } = require('uuid');
    const verifyToken = require('../middleware/auth');

    module.exports = (db) => {
        const router = require('express').Router();

        // Create a new task with UUID as id
        router.post('/', verifyToken, (req, res) => {
            const { title, status } = req.body;
            const taskId = uuidv4(); // Generate a unique task ID using UUID

            db.run(`INSERT INTO tasks (id, title, status, user_id) VALUES (?, ?, ?, ?)`, [taskId, title, status, req.userId], function(err) {
                if (err) {
                    return res.status(400).send(err.message);
                }
                res.status(201).send({ message: 'Task created successfully', taskId });
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


        // Update task title or status
    router.put('/:id', verifyToken, (req, res) => {
        const { title, status } = req.body;

        // Update both title and status if provided, otherwise just update one
        let query = `UPDATE tasks SET `;
        const queryParams = [];
        if (title) {
            query += `title = ? `;
            queryParams.push(title);
        }
        if (status) {
            if (title) query += `, `;
            query += `status = ? `;
            queryParams.push(status);
        }
        query += `WHERE id = ? AND user_id = ?`;
        queryParams.push(req.params.id, req.userId);

        db.run(query, queryParams, function(err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.status(200).send({ message: 'Task updated successfully' });
        });
    });

        return router;
    };
