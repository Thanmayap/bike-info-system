import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useLocation } from '../context/LocationContext.jsx';
import { Bike, Sun, Moon, LogOut, LayoutDashboard, Search, MapPin, Globe } from 'lucide-react';
import LocationModal from './LocationModal.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const { activeCity } = useLocation();
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? 'text-neon font-semibold' : 'text-slate-300 hover:text-white transition-all duration-200'}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-900/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg hover:opacity-95 transition-all">
          <Bike className="text-neon animate-pulse" /> <span className="tracking-wide">BikeIQ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={link}>{t('home')}</NavLink>
          <NavLink to="/search" className={link}>{t('bikes')}</NavLink>
          <NavLink to="/compare" className={link}>{t('compare')}</NavLink>
          <NavLink to="/about" className={link}>{t('about')}</NavLink>
          <NavLink to="/contact" className={link}>{t('contact')}</NavLink>
        </nav>
        
        <div className="ml-auto flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* Beautiful Inline Expanding Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 focus:w-56 transition-all duration-300 px-3.5 py-1.5 pl-9 bg-white/5 border border-white/10 rounded-full text-xs outline-none focus:border-neon focus:bg-white/10 text-white placeholder-slate-400"
            />
            <Search size={13} className="absolute left-3 text-slate-400 pointer-events-none" />
          </form>

          {/* Mobile search fallback icon */}
          <button onClick={() => nav('/search')} className="md:hidden btn btn-ghost p-1.5 sm:p-2 text-slate-300"><Search size={16}/></button>
          
          {/* Location selector pin */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="btn btn-ghost text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 border border-white/5 hover:border-white/10 rounded-lg cursor-pointer shrink-0 max-w-[90px] sm:max-w-none"
            title={t('selectCity')}
          >
            <MapPin size={14} className="text-neon animate-pulse shrink-0" />
            <span className="font-semibold text-slate-200 truncate">{activeCity}</span>
          </button>

          {/* Language selector dropdown - hidden on extra small screens */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-white/5 hover:border-white/10 rounded-lg cursor-pointer shrink-0 bg-transparent">
            <Globe size={14} className="text-neon" />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-slate-200 font-bold uppercase tracking-wider text-xs outline-none cursor-pointer appearance-none"
              title="Select Language / भाषा चुनें"
            >
              <option value="en" className="text-black">EN</option>
              <option value="hi" className="text-black">HI</option>
              <option value="kn" className="text-black">KN</option>
              <option value="te" className="text-black">TE</option>
              <option value="ta" className="text-black">TA</option>
            </select>
          </div>

          <button onClick={toggle} className="btn btn-ghost p-1.5 sm:p-2 text-slate-300 hover:text-white shrink-0" aria-label="Toggle theme">
            {theme==='dark'?<Sun size={14} className="sm:w-4 sm:h-4"/>:<Moon size={14} className="sm:w-4 sm:h-4"/>}
          </button>
          
          {user ? (
            <>
              <Link to={user.role==='admin'?'/admin':'/dashboard'} className="hidden sm:flex btn btn-ghost text-xs items-center gap-1.5 px-3 py-1.5 border border-white/5 hover:border-white/10 rounded-lg shrink-0"><LayoutDashboard size={14}/> {t('dashboard')}</Link>
              <button onClick={logout} className="btn btn-primary text-xs py-1.5 px-2 sm:px-3.5 shrink-0"><LogOut size={14} className="sm:hidden"/> <span className="hidden sm:inline">{t('logout')}</span></button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block btn btn-ghost text-xs px-3.5 py-1.5 shrink-0">{t('login')}</Link>
              <Link to="/register" className="btn btn-primary text-[10px] sm:text-xs px-2 sm:px-3.5 py-1.5 font-bold shadow-md shadow-neon/10 shrink-0">{t('signup')}</Link>
            </>
          )}
        </div>
      </div>

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} />
      )}
    </header>
  );
}

