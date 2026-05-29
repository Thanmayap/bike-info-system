import { Outlet, useLocation, Link } from 'react-router-dom';
import { Scale, X } from 'lucide-react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useCompare } from '../context/CompareContext.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const { selectedBikes, clearCompare } = useCompare();
  const hideChrome = ['/login','/register','/forgot-password'].includes(pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-neon text-black text-xs font-bold py-1.5 w-full overflow-hidden flex items-center justify-center tracking-widest uppercase relative z-50 shadow-md">
        <marquee scrollamount="6">
          🚀 THE BIGGEST BIKE SALE IS LIVE! GET UPTO 20% OFF ON RIDING GEAR & ACCESSORIES! 🔥 DON'T MISS OUT ON OUR EXCLUSIVE WEEKEND OFFERS! 🚀
        </marquee>
      </div>
      {!hideChrome && <Navbar />}
      <main className="flex-1 relative">
        <Outlet />
        {selectedBikes.length > 0 && !pathname.includes('/compare') && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center bg-[#0a2b26] border border-[#238b78] rounded-full shadow-lg shadow-neon/20 animate-fade-in-up">
            <Link 
              to="/compare" 
              className="flex items-center gap-2 px-5 py-3 text-[#38e6c8] hover:text-white font-bold tracking-wide transition-colors"
            >
              <Scale size={18} />
              Compare ({selectedBikes.length})
            </Link>
            <button 
              onClick={clearCompare} 
              className="pr-4 pl-2 py-3 text-[#238b78] hover:text-red-400 transition-colors"
              title="Clear comparison"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
