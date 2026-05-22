import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Heart, Clock, User, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user } = useAuth();
  const link = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${isActive ? 'bg-neon/10 text-neon' : 'text-slate-300 hover:bg-white/5'}`;
  return (
    <aside className="glass p-4 h-fit sticky top-20 w-60 hidden md:block">
      <div className="px-2 pb-3 text-sm">
        <div className="text-slate-400">Signed in as</div>
        <div className="font-semibold">{user?.name}</div>
      </div>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={link}><LayoutDashboard size={16}/> Overview</NavLink>
        <NavLink to="/profile" className={link}><User size={16}/> Profile</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin" className={link}><ShieldCheck size={16}/> Admin</NavLink>}
      </nav>
    </aside>
  );
}
