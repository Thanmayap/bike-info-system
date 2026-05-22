import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Bike, Sun, Moon, LogOut, LayoutDashboard, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? 'text-neon' : 'text-slate-300 hover:text-white'}`;
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-900/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Bike className="text-neon" /> <span>BikeIQ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/search" className={link}>Bikes</NavLink>
          <NavLink to="/compare" className={link}>Compare</NavLink>
          <NavLink to="/about" className={link}>About</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => nav('/search')} className="btn btn-ghost p-2"><Search size={16}/></button>
          <button onClick={toggle} className="btn btn-ghost p-2">{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button>
          {user ? (
            <>
              <Link to={user.role==='admin'?'/admin':'/dashboard'} className="btn btn-ghost"><LayoutDashboard size={16}/> {user.role==='admin'?'Admin':'Dashboard'}</Link>
              <button onClick={logout} className="btn btn-primary"><LogOut size={16}/> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
