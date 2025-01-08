import express from 'express';
import { addBook, getAllBooks, getBookById, updateBook, deleteBook, searchBooks, filterBooks, getAllBooksPaginated } from '../controllers/bookController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/', protect, addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);  // :id is for finding by ID
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);
router.get('/search/books', searchBooks);  // This is the search route
router.get('/filter/books', filterBooks);  // This is the filter route
router.get('/paginated/books', getAllBooksPaginated);  // Ensure this points to the paginated handler

export default router;
