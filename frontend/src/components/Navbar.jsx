import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, User, Search, Menu, LogOut, Plus } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const isActive = (path) => {
    return location.pathname === path ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-primary";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <BookOpen className="text-primary h-6 w-6" />
            <span>Veronica's</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={`font-medium transition-colors ${isActive('/')}`}>Home</Link>
            <Link to="/catalog" className={`font-medium transition-colors ${isActive('/catalog')}`}>Catalog</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/add-book" className="hidden md:flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                <Plus className="h-4 w-4" /> Add Book
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-sm font-medium">
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-2 btn-primary px-4 py-2 rounded-full text-sm font-medium">
                  Register
                </Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full transition-colors text-sm font-medium">
                <LogOut className="h-4 w-4" />
                Sign Out ({user?.name?.split(' ')[0]})
              </button>
            )}
            <button className="md:hidden text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
