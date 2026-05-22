import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Bike, Star, GitCompare, Plus, Trash2, Pencil } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank());

  function blank() { return { brand:'', model:'', price:'', mileage:'', engine_cc:'', power:'', torque:'', top_speed:'', fuel_capacity:'', transmission:'', features:'', description:'', is_featured:false, image:null }; }

  const load = async () => {
    setStats((await api.get('/admin/stats')).data);
    setUsers((await api.get('/admin/users')).data);
    setBikes((await api.get('/bikes')).data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => v!==null && v!==undefined && fd.append(k, v));
    try {
      if (editing) await api.put(`/bikes/${editing}`, fd);
      else await api.post('/bikes', fd);
      toast.success('Saved'); setForm(blank()); setEditing(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const editBike = (b) => { setEditing(b.id); setForm({ ...blank(), ...b, image: null }); setTab('add'); };
  const delBike = async (id) => { await api.delete(`/bikes/${id}`); toast.success('Deleted'); load(); };
  const delUser = async (id) => { await api.delete(`/admin/users/${id}`); toast.success('Deleted'); load(); };

  if (!stats) return <div className="p-10 text-center">Loading...</div>;

  const cards = [
    { label:'Users', value:stats.users, icon:Users, color:'text-sky-400' },
    { label:'Bikes', value:stats.bikes, icon:Bike, color:'text-neon' },
    { label:'Reviews', value:stats.reviews, icon:Star, color:'text-amber-400' },
    { label:'Comparisons', value:stats.comparisons, icon:GitCompare, color:'text-rose-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="flex gap-2 mt-6 border-b border-white/10">
        {['overview','bikes','add','users'].map(t => (
          <button key={t} onClick={()=>{ setTab(t); if(t!=='add'){ setEditing(null); setForm(blank()); } }}
                  className={`px-4 py-2 capitalize text-sm ${tab===t?'border-b-2 border-neon text-neon':'text-slate-400'}`}>
            {t === 'add' ? (editing ? 'Edit bike' : 'Add bike') : t}
          </button>
        ))}
      </div>

      {tab==='overview' && (
        <div className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(c => (
              <div key={c.label} className="glass p-5">
                <c.icon className={c.color}/>
                <div className="text-3xl font-bold mt-3">{c.value}</div>
                <div className="text-sm text-slate-400">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="glass p-5">
              <h3 className="font-semibold mb-4">Bikes by brand</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.byBrand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="brand" stroke="#888"/><YAxis stroke="#888"/>
                  <Tooltip contentStyle={{ background:'#10151c', border:'1px solid #222' }}/>
                  <Bar dataKey="total" fill="#00f0a8"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass p-5">
              <h3 className="font-semibold mb-4">User signups</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={stats.usersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="month" stroke="#888"/><YAxis stroke="#888"/>
                  <Tooltip contentStyle={{ background:'#10151c', border:'1px solid #222' }}/>
                  <Line type="monotone" dataKey="total" stroke="#00f0a8" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="font-semibold mt-8 mb-3">Recent uploads</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.recent.map(b => (
              <div key={b.id} className="glass p-3 text-sm">
                <div className="font-semibold">{b.brand}</div>
                <div className="text-slate-400">{b.model}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='bikes' && (
        <div className="glass mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400">
              <th className="p-3">Brand</th><th>Model</th><th>Price</th><th>cc</th><th></th>
            </tr></thead>
            <tbody>
              {bikes.map(b => (
                <tr key={b.id} className="border-t border-white/5">
                  <td className="p-3">{b.brand}</td><td>{b.model}</td>
                  <td>₹{Number(b.price).toLocaleString('en-IN')}</td><td>{b.engine_cc}</td>
                  <td className="text-right pr-3">
                    <button onClick={()=>editBike(b)} className="btn btn-ghost p-2 mr-2"><Pencil size={14}/></button>
                    <button onClick={()=>delBike(b.id)} className="btn btn-ghost p-2"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='add' && (
        <form onSubmit={submit} className="glass p-6 mt-6 grid md:grid-cols-2 gap-4">
          {['brand','model','price','mileage','engine_cc','power','torque','top_speed','fuel_capacity','transmission','features'].map(f => (
            <input key={f} placeholder={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})}
                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          ))}
          <textarea placeholder="description" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}
                    className="md:col-span-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg" rows="3"/>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})}/> Featured</label>
          <input type="file" accept="image/*" onChange={e=>setForm({...form,image:e.target.files[0]})}/>
          <button className="btn btn-primary md:col-span-2"><Plus size={16}/> {editing?'Update bike':'Create bike'}</button>
        </form>
      )}

      {tab==='users' && (
        <div className="glass mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400"><th className="p-3">Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="p-3">{u.name}</td><td>{u.email}</td>
                  <td><span className={`text-xs px-2 py-1 rounded ${u.role==='admin'?'bg-neon/10 text-neon':'bg-white/5'}`}>{u.role}</span></td>
                  <td className="text-right pr-3">
                    {u.role!=='admin' && <button onClick={()=>delUser(u.id)} className="btn btn-ghost p-2"><Trash2 size={14}/></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
