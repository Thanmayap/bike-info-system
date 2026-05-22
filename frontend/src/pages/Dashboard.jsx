import { useEffect, useState } from 'react';
import { Heart, Clock, GitCompare, User } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import BikeCard from '../components/BikeCard.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ saved:0, compared:0, recent:0 });
  const [saved, setSaved] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/users/stats').then(r => setStats(r.data));
    api.get('/users/wishlist').then(r => setSaved(r.data));
    api.get('/users/recent').then(r => setRecent(r.data));
  }, []);

  const cards = [
    { label:'Saved bikes', value:stats.saved, icon:Heart, color:'text-rose-400' },
    { label:'Compared', value:stats.compared, icon:GitCompare, color:'text-neon' },
    { label:'Recently viewed', value:stats.recent, icon:Clock, color:'text-amber-400' },
    { label:'Profile', value:'View', icon:User, color:'text-sky-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[240px_1fr] gap-6">
      <Sidebar/>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your bikes.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {cards.map(c => (
            <div key={c.label} className="glass p-5">
              <c.icon className={c.color}/>
              <div className="text-2xl font-bold mt-3">{c.value}</div>
              <div className="text-sm text-slate-400">{c.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-10 mb-4">Saved bikes</h2>
        {saved.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{saved.map(b => <BikeCard key={b.id} bike={b}/>)}</div>
        ) : <p className="text-slate-500 text-sm">No saved bikes yet.</p>}

        <h2 className="text-xl font-bold mt-10 mb-4">Recently viewed</h2>
        {recent.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{recent.map(b => <BikeCard key={b.id} bike={b}/>)}</div>
        ) : <p className="text-slate-500 text-sm">Nothing viewed yet.</p>}
      </div>
    </div>
  );
}
