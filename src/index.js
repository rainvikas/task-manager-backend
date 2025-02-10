require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const setupSwagger = require('../docs/swagger');
// const { errorHandler } = require('./src/utils/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

setupSwagger(app);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware    
// app.use(errorHandler);

// Connect to MongoDB and Start Server Only If Not in Test Mode
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
    });
}

module.exports = app;