import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BookOpen, ArrowLeft, Calendar, Hash, Tag, User, Clock } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowMsg, setBorrowMsg] = useState('');
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        setError('Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBorrowing(true);
    try {
      await axios.post('http://localhost:5000/api/v1/transactions/issue',
        { bookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBorrowMsg('Book borrowed successfully! Due in 7 days.');
      setBook(prev => ({ ...prev, availableCopies: prev.availableCopies - 1 }));
    } catch (err) {
      setBorrowMsg(err.response?.data?.error || 'Failed to borrow book.');
    } finally {
      setBorrowing(false);
      setTimeout(() => setBorrowMsg(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="glass-panel p-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'This book does not exist.'}</p>
        <button onClick={() => navigate('/catalog')} className="btn-primary">Back to Catalog</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <button onClick={() => navigate('/catalog')} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {borrowMsg && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${borrowMsg.includes('success') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
          {borrowMsg}
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-12">
            <div className="text-center">
              <BookOpen className="w-24 h-24 text-primary/30 mx-auto mb-4" />
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'All Copies Issued'}
              </span>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-500 mb-6">by {book.author}</p>

            {book.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Genre</p>
                  <p className="font-medium text-gray-900">{book.genre}</p>
                </div>
              </div>
              {book.publishedYear && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-400">Published</p>
                    <p className="font-medium text-gray-900">{book.publishedYear}</p>
                  </div>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-400">ISBN</p>
                    <p className="font-medium text-gray-900">{book.isbn}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Total Copies</p>
                  <p className="font-medium text-gray-900">{book.totalCopies}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBorrow}
              disabled={book.availableCopies === 0 || borrowing}
              className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${
                book.availableCopies > 0
                  ? 'btn-primary'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {borrowing ? 'Processing...' : book.availableCopies > 0 ? 'Borrow This Book' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
