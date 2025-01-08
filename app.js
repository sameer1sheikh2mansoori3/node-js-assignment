import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// MongoDB Connection
const connectToDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
        await mongoose.connect(mongoUri, { dbName: 'bookstoredb' });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Server Initialization
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    return server;
};

export { app, connectToDatabase, startServer };
