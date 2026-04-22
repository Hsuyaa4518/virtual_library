import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PlusCircle, Book, Tag, Hash, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    publishedYear: '',
    totalCopies: 1
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // If simple role check to prevent non-admins, though API protects too
  if (user?.role !== 'admin') {
     return <div className="text-center py-20 text-red-500 text-xl font-bold">Access Denied. Admins Only.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Adding book...' });
    try {
      await axios.post('http://localhost:5000/api/v1/books', {
         ...formData,
         publishedYear: parseInt(formData.publishedYear),
         totalCopies: parseInt(formData.totalCopies)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Book successfully added to catalog!' });
      setTimeout(() => navigate('/catalog'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to add book.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="text-center mb-8">
           <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="text-primary w-8 h-8" />
           </div>
           <h2 className="text-3xl font-bold text-gray-900">Manual Book Listing</h2>
           <p className="text-gray-500 mt-2">Add new inventory tracking entries to the library catalogue.</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
              <div className="relative">
                 <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input type="text" name="title" onChange={handleChange} required className="input-field pl-10" placeholder="e.g. The Hobbit" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <div className="relative">
                 <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input type="text" name="author" onChange={handleChange} required className="input-field pl-10" placeholder="e.g. J.R.R. Tolkien" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <div className="relative">
                 <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input type="text" name="genre" onChange={handleChange} required className="input-field pl-10" placeholder="e.g. Fantasy" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
              <div className="relative">
                 <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input type="number" min="1" name="totalCopies" onChange={handleChange} required className="input-field pl-10" placeholder="1" defaultValue="1" />
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full btn-primary py-3">Publish to Directory</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBook;
