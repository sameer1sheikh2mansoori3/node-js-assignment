import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Bookstore API');
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

connectDB()
// Server Initialization
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    return server;
};

startServer()
export { app, connectDB, startServer };
