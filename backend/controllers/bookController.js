const Book = require('../models/Book');

exports.getBooks = async (req, res, next) => {
    try {
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'query'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        let parsedQuery = JSON.parse(queryStr);
        if (req.query.query) {
            const searchRegex = new RegExp(req.query.query, 'i');
            parsedQuery = {
                ...parsedQuery,
                $or: [
                    { title: searchRegex },
                    { author: searchRegex },
                    { genre: searchRegex }
                ]
            };
        }

        const books = await Book.find(parsedQuery);
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) {
        next(err);
    }
};

exports.getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        next(err);
    }
};

exports.createBook = async (req, res, next) => {
    try {
        if (req.body.totalCopies && req.body.availableCopies === undefined) {
            req.body.availableCopies = req.body.totalCopies;
        }
        const book = await Book.create(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (err) {
        next(err);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

        book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

        await book.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
