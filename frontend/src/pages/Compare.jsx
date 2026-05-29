import { useEffect, useState } from 'react';
import api from '../api/client';
import { X } from 'lucide-react';
import { useCompare } from '../context/CompareContext.jsx';

export default function Compare() {
  const [all, setAll] = useState([]);
  const { selectedBikes, toggleCompare, removeCompare } = useCompare();
  const [data, setData] = useState([]);

  useEffect(() => { api.get('/bikes').then(r => setAll(r.data)); }, []);

  const add = (id) => { if (!selectedBikes.includes(id)) toggleCompare(id); };
  const remove = (id) => removeCompare(id);

  useEffect(() => {
    if (!selectedBikes.length) return setData([]);
    api.post('/bikes/compare', { ids: selectedBikes }).then(r => setData(r.data));
  }, [selectedBikes]);

  const rows = [
    ['Brand','brand'],['Model','model'],['Price','price'],['Mileage','mileage'],
    ['Engine (cc)','engine_cc'],['Power','power'],['Torque','torque'],
    ['Top speed','top_speed'],['Transmission','transmission'],['Features','features'],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Compare bikes</h1>
      <p className="text-slate-400 mb-6">Pick up to 4 bikes to compare side-by-side.</p>

      <select onChange={(e)=>{ if(e.target.value) add(Number(e.target.value)); e.target.value=''; }}
              className="w-full md:w-80 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
        <option value="">+ Add a bike to compare</option>
        {all.map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}
      </select>

      {!!data.length && (
        <div className="mt-8 overflow-x-auto glass">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-4">Spec</th>
                {data.map(b => (
                  <th key={b.id} className="p-4 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span>{b.brand} {b.model}</span>
                      <button onClick={()=>remove(b.id)}><X size={14} className="text-slate-400 hover:text-white"/></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label,key]) => (
                <tr key={key} className="border-t border-white/5">
                  <td className="p-4 text-slate-400">{label}</td>
                  {data.map(b => <td key={b.id} className="p-4">{String(b[key] ?? '—')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
