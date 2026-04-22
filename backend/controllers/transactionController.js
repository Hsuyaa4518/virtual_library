const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

const MAX_BORROW_LIMIT = 5;
const FINE_PER_DAY = 1;
const MAX_DAYS_ALLOWED = 7;

exports.issueBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        if (book.availableCopies <= 0) return res.status(400).json({ success: false, error: 'Book currently unavailable' });

        const activeTransactions = await Transaction.countDocuments({ user: userId, status: 'borrowed' });
        if (activeTransactions >= MAX_BORROW_LIMIT) {
            return res.status(400).json({ success: false, error: `Borrow limit of ${MAX_BORROW_LIMIT} reached` });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + MAX_DAYS_ALLOWED);

        const transaction = await Transaction.create({ user: userId, book: bookId, dueDate });

        book.availableCopies -= 1;
        await book.save();

        await User.findByIdAndUpdate(userId, { $push: { borrowHistory: transaction._id } });

        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        next(err);
    }
};

exports.returnBook = async (req, res, next) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
        if (transaction.status !== 'borrowed') return res.status(400).json({ success: false, error: 'Book already returned' });

        const returnDate = new Date();
        let fine = 0;

        if (returnDate > transaction.dueDate) {
            const diffTime = Math.abs(returnDate - transaction.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * FINE_PER_DAY;
        }

        transaction.status = fine > 0 ? 'overdue' : 'returned';
        transaction.returnDate = returnDate;
        transaction.fine = fine;
        await transaction.save();

        const book = await Book.findById(transaction.book);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.status(200).json({ success: true, data: transaction, fineApplied: fine });
    } catch (err) {
        next(err);
    }
};

exports.getMyTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).populate('book', 'title author').sort('-issueDate');
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        next(err);
    }
};
