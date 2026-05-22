import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import BikeCard from '../components/BikeCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: params.get('q') || '', brand: params.get('brand') || '', minPrice: '', maxPrice: '', minMileage: ''
  });

  const load = async (overrideFilters) => {
    setLoading(true);
    const f = overrideFilters || filters;
    const { data } = await api.get('/bikes', { params: f });
    setBikes(data); setLoading(false);
  };

  // Re-run when URL changes (e.g. clicking a brand card)
  useEffect(() => {
    const q = params.get('q') || '';
    const brand = params.get('brand') || '';
    const newFilters = { search: q, brand, minPrice: '', maxPrice: '', minMileage: '' };
    setFilters(newFilters);
    load(newFilters);
  // eslint-disable-next-line
  }, [params.get('q'), params.get('brand')]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="glass p-5 h-fit">
        <h3 className="font-semibold">Filters</h3>
        <div className="space-y-3 mt-4 text-sm">
          <input placeholder="Search" value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}
                 className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <input placeholder="Brand" value={filters.brand} onChange={e=>setFilters({...filters,brand:e.target.value})}
                 className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Min ₹" value={filters.minPrice} onChange={e=>setFilters({...filters,minPrice:e.target.value})}
                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <input placeholder="Max ₹" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}
                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          </div>
          <input placeholder="Min mileage (kmpl)" value={filters.minMileage} onChange={e=>setFilters({...filters,minMileage:e.target.value})}
                 className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <button onClick={() => load()} className="btn btn-primary w-full">Apply</button>
        </div>
      </aside>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{bikes.length} bikes found</h1>
        </div>
        {loading ? <Loader/> :
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {bikes.map(b => <BikeCard key={b.id} bike={b}/>)}
          </div>}
      </div>
    </div>
  );
}
