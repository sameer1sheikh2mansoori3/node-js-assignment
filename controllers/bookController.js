import Book from '../models/Book.js';

// Add a new book
export const addBook = async (req, res) => {
    const { title, author, price, description } = req.body;
    const book = new Book({ title, author, price, description });

    try {
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Fetch all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Fetch a single book by ID
export const getBookById = async (req, res) => {
    console.log("****");
    try {

        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update book details
export const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a book by ID
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Search books by title
// Search books by title
// Search books by title
export const searchBooks = async (req, res) => {
    console.log(req.query);
    try {
        const title = req.query.title;  // Get the title from the query string

        // Ensure title is provided
        if (!title) {
            return res.status(400).json({ message: 'Title query parameter is required' });
        }

        // Search books by title using RegExp for case-insensitive matching
        const books = await Book.find({
            title: new RegExp(title, 'i'),  // 'i' for case-insensitive matching
        });

        // Return the books that match
        res.json(books);
    } catch (err) {

        res.status(400).json({ message: err.message });
    }
};



// Filter books by author and price range
export const filterBooks = async (req, res) => {
    console.log(req.query);
    try {
        const { author, minPrice, maxPrice } = req.query;

        const books = await Book.find({
            author: new RegExp(author, 'i'),
            price: { $gte: minPrice, $lte: maxPrice },
        });
        res.json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// Modify getAllBooks to add pagination
// Get paginated list of books
export const getAllBooksPaginated = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Default page is 1
    const limit = parseInt(req.query.limit) || 10;  // Default limit is 10
    const skip = (page - 1) * limit;  // Skip for pagination

    try {
        // Find books with pagination logic (skip and limit)
        const books = await Book.find().skip(skip).limit(limit);

        // If no books found
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        // Return the paginated books
        res.json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

