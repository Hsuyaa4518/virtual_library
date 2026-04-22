import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../features/books/booksSlice';
import { Search, BookMarked, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Catalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: books, status, error } = useSelector((state) => state.books);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchBooks(searchTerm));
  };

  const handleBorrow = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/v1/transactions/issue',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Book borrowed successfully! Due in 7 days.');
      setTimeout(() => setMessage(''), 3000);
      dispatch(fetchBooks(searchTerm));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to borrow book.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {message && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-100 text-emerald-800 px-4 py-3 rounded-lg shadow-xl font-medium animate-in slide-in-from-right">
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Directory</h1>
          <p className="text-gray-600">Explore our vast collection of books.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search title, author, genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all glass-panel shadow-sm"
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 min-h-[300px] animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="col-span-full py-20 text-center glass-panel">
          <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">Unable to load books</h3>
          <p className="text-gray-500 mt-2">Make sure the backend server is running on port 5000.</p>
          <button onClick={() => dispatch(fetchBooks())} className="btn-primary mt-4">Retry</button>
        </div>
      )}

      {status === 'succeeded' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length > 0 ? books.map((book) => (
            <Link to={`/books/${book._id}`} key={book._id} className="glass-panel p-5 group flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer">
              <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${book.availableCopies > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {book.availableCopies > 0 ? 'Available' : 'Issued Out'}
              </div>

              <div className="h-48 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <BookMarked className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{book.author}</p>
              {book.publishedYear && <p className="text-xs text-gray-400 mb-3">Published {book.publishedYear}</p>}

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-md text-gray-600">{book.genre}</span>
                <button
                  onClick={(e) => handleBorrow(e, book._id)}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${book.availableCopies > 0 ? 'text-primary hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`}
                  disabled={book.availableCopies === 0}>
                  {book.availableCopies > 0 ? 'Borrow' : 'Waitlist'}
                </button>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center glass-panel">
              <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900">No books found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;
