const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre']
    },
    description: {
        type: String
    },
    publishedYear: {
        type: Number
    },
    totalCopies: {
        type: Number,
        default: 1,
        min: 1
    },
    availableCopies: {
        type: Number,
        default: 1,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
