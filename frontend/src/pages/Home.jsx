import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, Zap } from 'lucide-react';
import api from '../api/client';
import BikeCard from '../components/BikeCard.jsx';
import BrandsGrid from '../components/SimilarBrands.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/bikes?featured=1').then(r => setFeatured(r.data.slice(0,3)));
    api.get('/bikes').then(r => setLatest(r.data.slice(0,6)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-28 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-white/10 text-slate-300"><Sparkles size={12} className="text-neon"/> Smarter bike research</span>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
              Find your <span className="text-neon">perfect ride</span>.
              <br/>Compare. Decide. Ride.
            </h1>
            <p className="text-slate-400 mt-4 max-w-lg">
              Engine specs, mileage, real reviews and side-by-side comparisons — all the data you need to choose your next bike with confidence.
            </p>
            <form onSubmit={(e)=>{e.preventDefault(); window.location.href=`/search?q=${encodeURIComponent(q)}`;}}
                  className="mt-6 flex gap-2 max-w-md">
              <div className="flex-1 flex items-center gap-2 px-3 bg-white/5 border border-white/10 rounded-xl">
                <Search size={16} className="text-slate-400"/>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by brand or model..." className="flex-1 bg-transparent py-3 outline-none"/>
              </div>
              <button className="btn btn-primary">Search</button>
            </form>
            <div className="flex gap-3 mt-6">
              <Link to="/compare" className="btn btn-ghost"><Zap size={16}/> Compare bikes <ArrowRight size={16}/></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
                      className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon/30 to-transparent border border-white/10 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=70"
                   alt="Featured bike" className="rounded-3xl object-cover w-full h-full opacity-90"/>
            </div>
            <div className="absolute -bottom-6 -left-6 glass p-4 w-56">
              <div className="text-xs text-slate-400">Top performer</div>
              <div className="font-semibold">KTM Duke 390</div>
              <div className="text-neon font-bold mt-1">170 km/h</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured bikes</h2>
          <Link to="/search" className="text-sm text-neon">View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(b => <BikeCard key={b.id} bike={b}/>)}
        </div>
      </section>

      {/* Latest */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Latest additions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map(b => <BikeCard key={b.id} bike={b}/>)}
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <BrandsGrid currentBrand={null} />
      </section>
    </div>
  );
}
