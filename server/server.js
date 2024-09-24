const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const db = require('./db/db'); // Import the database connection
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes(db));
app.use('/api/tasks', taskRoutes(db));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
