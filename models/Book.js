import { Schema, model } from 'mongoose';

const bookSchema = Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

const Book = model('Book', bookSchema);

export default Book;
