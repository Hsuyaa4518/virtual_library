const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veronicas_library';

const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    genre: 'Fiction',
    description: 'A novel about racial injustice in the Deep South, seen through the eyes of young Scout Finch.',
    publishedYear: 1960,
    totalCopies: 5,
    availableCopies: 3
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-45-152493-5',
    genre: 'Dystopian',
    description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.',
    publishedYear: 1949,
    totalCopies: 4,
    availableCopies: 2
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    genre: 'Romance',
    description: 'A witty tale of love and misunderstanding in Georgian England.',
    publishedYear: 1813,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-74-327356-5',
    genre: 'Fiction',
    description: 'A story of wealth, love, and the American Dream set in the Jazz Age.',
    publishedYear: 1925,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '978-0-74-753274-1',
    genre: 'Fantasy',
    description: 'A young wizard discovers his magical heritage on his eleventh birthday.',
    publishedYear: 1997,
    totalCopies: 6,
    availableCopies: 4
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0-54-792822-7',
    genre: 'Fantasy',
    description: 'Bilbo Baggins embarks on an unexpected journey with a company of dwarves.',
    publishedYear: 1937,
    totalCopies: 3,
    availableCopies: 2
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-31-676948-0',
    genre: 'Fiction',
    description: 'The story of teenager Holden Caulfield and his experiences in New York City.',
    publishedYear: 1951,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '978-0-06-085052-4',
    genre: 'Dystopian',
    description: 'A futuristic society where humans are genetically modified and socially conditioned.',
    publishedYear: 1932,
    totalCopies: 3,
    availableCopies: 2
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '978-0-06-112241-5',
    genre: 'Adventure',
    description: 'A shepherd boy journeys from Spain to Egypt in search of treasure and self-discovery.',
    publishedYear: 1988,
    totalCopies: 4,
    availableCopies: 3
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Bronte',
    isbn: '978-0-14-144114-6',
    genre: 'Romance',
    description: 'An orphaned governess falls in love with her mysterious employer, Mr. Rochester.',
    publishedYear: 1847,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    isbn: '978-0-14-044913-6',
    genre: 'Thriller',
    description: 'A young man commits a murder and struggles with guilt and redemption.',
    publishedYear: 1866,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0-55-338016-3',
    genre: 'Science',
    description: 'An exploration of cosmology, black holes, and the nature of time.',
    publishedYear: 1988,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0-06-231609-7',
    genre: 'Non-Fiction',
    description: 'A sweeping narrative of human history from the Stone Age to the modern era.',
    publishedYear: 2011,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    isbn: '978-1-59-030227-8',
    genre: 'Philosophy',
    description: 'An ancient Chinese text on military strategy and tactics.',
    publishedYear: -500,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-73-521129-2',
    genre: 'Self-Help',
    description: 'A practical guide to building good habits and breaking bad ones.',
    publishedYear: 2018,
    totalCopies: 5,
    availableCopies: 3
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0-44-117271-9',
    genre: 'Science Fiction',
    description: 'An epic tale of politics, religion, and ecology on a desert planet.',
    publishedYear: 1965,
    totalCopies: 3,
    availableCopies: 2
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    isbn: '978-1-59-463193-1',
    genre: 'Fiction',
    description: 'A story of friendship, betrayal, and redemption set in Afghanistan.',
    publishedYear: 2003,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    isbn: '978-0-14-143947-1',
    genre: 'Horror',
    description: 'A scientist creates a sentient creature in an unorthodox experiment.',
    publishedYear: 1818,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    isbn: '978-0-30-747427-8',
    genre: 'Thriller',
    description: 'A symbologist uncovers a secret kept hidden for centuries by a religious society.',
    publishedYear: 2003,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    isbn: '978-1-61-253017-0',
    genre: 'Finance',
    description: 'Personal finance lessons learned from two different father figures.',
    publishedYear: 1997,
    totalCopies: 4,
    availableCopies: 3
  }
];

const users = [
  {
    name: 'Admin Veronica',
    email: 'admin@veronicaslibrary.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Ayush Sharma',
    email: 'ayush@example.com',
    password: 'user1234',
    role: 'user'
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'user1234',
    role: 'user'
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@example.com',
    password: 'user1234',
    role: 'user'
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    password: 'user1234',
    role: 'user'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data.');

    // Insert books
    const createdBooks = await Book.insertMany(books);
    console.log(`${createdBooks.length} books inserted.`);

    // Insert users (password hashing handled by pre-save hook)
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users created.`);

    // Create some sample transactions
    const now = new Date();
    const transactions = [
      {
        user: createdUsers[1]._id, // Ayush
        book: createdBooks[0]._id, // To Kill a Mockingbird
        issueDate: new Date(now - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now + 4 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
        fine: 0
      },
      {
        user: createdUsers[1]._id, // Ayush
        book: createdBooks[4]._id, // Harry Potter
        issueDate: new Date(now - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now - 6 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now - 3 * 24 * 60 * 60 * 1000),
        status: 'returned',
        fine: 3
      },
      {
        user: createdUsers[2]._id, // Priya
        book: createdBooks[1]._id, // 1984
        issueDate: new Date(now - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now + 9 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
        fine: 0
      },
      {
        user: createdUsers[3]._id, // Rahul
        book: createdBooks[5]._id, // The Hobbit
        issueDate: new Date(now - 18 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now - 4 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        fine: 4
      },
      {
        user: createdUsers[4]._id, // Sneha
        book: createdBooks[14]._id, // Atomic Habits
        issueDate: new Date(now - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now + 7 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
        fine: 0
      },
      {
        user: createdUsers[2]._id, // Priya
        book: createdBooks[8]._id, // The Alchemist
        issueDate: new Date(now - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now - 11 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now - 10 * 24 * 60 * 60 * 1000),
        status: 'returned',
        fine: 1
      },
      {
        user: createdUsers[3]._id, // Rahul
        book: createdBooks[15]._id, // Dune
        issueDate: new Date(now - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now + 11 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
        fine: 0
      },
      {
        user: createdUsers[4]._id, // Sneha
        book: createdBooks[19]._id, // Rich Dad Poor Dad
        issueDate: new Date(now - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now - 1 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now),
        status: 'returned',
        fine: 1
      }
    ];

    const createdTransactions = await Transaction.insertMany(transactions);
    console.log(`${createdTransactions.length} transactions created.`);

    // Update user borrowHistory references
    for (const txn of createdTransactions) {
      await User.findByIdAndUpdate(txn.user, {
        $push: { borrowHistory: txn._id }
      });
    }
    console.log('User borrow histories updated.');

    console.log('\n--- Seed Complete ---');
    console.log('Admin login: admin@veronicaslibrary.com / admin123');
    console.log('User login:  ayush@example.com / user1234');
    console.log(`\nMongoDB URI: ${MONGODB_URI}`);
    console.log('Open MongoDB Compass and connect to the above URI to browse data.\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
