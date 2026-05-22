import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState({ name:'', email:'', phone:'', avatar:'' });
  const [pwd, setPwd] = useState({ current:'', next:'' });

  useEffect(() => { api.get('/users/me').then(r => setProfile(r.data)); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/users/me', profile);
    setUser((u) => ({ ...u, name: profile.name }));
    toast.success('Profile updated');
  };
  const changePwd = async (e) => {
    e.preventDefault();
    try { await api.post('/auth/change-password', pwd); toast.success('Password changed'); setPwd({current:'',next:''}); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[240px_1fr] gap-6">
      <Sidebar/>
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={save} className="glass p-6 space-y-3">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <input value={profile.name||''} onChange={e=>setProfile({...profile,name:e.target.value})}
                 placeholder="Name" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <input value={profile.email||''} disabled
                 className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg opacity-60"/>
          <input value={profile.phone||''} onChange={e=>setProfile({...profile,phone:e.target.value})}
                 placeholder="Phone" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <button className="btn btn-primary">Save changes</button>
        </form>

        <form onSubmit={changePwd} className="glass p-6 space-y-3">
          <h2 className="text-xl font-bold mb-2">Change password</h2>
          <input type="password" required value={pwd.current} onChange={e=>setPwd({...pwd,current:e.target.value})}
                 placeholder="Current password" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <input type="password" required value={pwd.next} onChange={e=>setPwd({...pwd,next:e.target.value})}
                 placeholder="New password" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          <button className="btn btn-primary">Update password</button>
        </form>
      </div>
    </div>
  );
}
