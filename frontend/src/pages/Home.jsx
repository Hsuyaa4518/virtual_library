import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary to-purple-800 text-white shadow-2xl glass-panel">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="relative z-10 px-8 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Reimagine Your <span className="text-accent">Reading</span> Experience
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-xl leading-relaxed">
              Discover, borrow, and manage your favorite books with our state-of-the-art intelligent library system. Fast, intuitive, and always in sync.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/catalog" className="bg-accent hover:bg-yellow-400 text-indigo-950 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center gap-2 hover:-translate-y-1">
                Explore Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Library" className="relative z-10 rounded-2xl shadow-2xl border-4 border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-500 will-change-transform" />
          </div>
        </div>
      </section>

      {/* Features Outline */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300">
          <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="text-primary w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Vast Collection</h3>
          <p className="text-gray-600 leading-relaxed">Access thousands of books across all genres. Real-time availability tracking guarantees you always know what's in stock.</p>
        </div>
        
        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Layers className="text-secondary w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Borrowing</h3>
          <p className="text-gray-600 leading-relaxed">Seamless checkout process with automated due date tracking and fine calculation to keep you organized.</p>
        </div>
        
        <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300">
          <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="text-accent w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">AI curation</h3>
          <p className="text-gray-600 leading-relaxed">Get personalized reading recommendations based on your borrowing history and preferences. (Our Unique Selling Point)</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
