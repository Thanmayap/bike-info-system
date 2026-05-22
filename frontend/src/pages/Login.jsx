import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success('Welcome back!');
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=70" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-transparent"/>
        <div className="absolute bottom-10 left-10 max-w-sm">
          <div className="flex items-center gap-2 font-display font-bold text-xl"><Bike className="text-neon"/> BikeIQ</div>
          <h2 className="text-3xl font-bold mt-4">Ride smarter.<br/>Choose better.</h2>
          <p className="text-slate-300 mt-2">Sign in to access your saved bikes, comparison history, and personalized recommendations.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="glass p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Login to your account</p>
          <div className="space-y-4 mt-6">
            <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                   placeholder="Email" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                   placeholder="Password" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <Link to="/forgot-password" className="text-sm text-neon block text-right">Forgot password?</Link>
            <button disabled={loading} className="btn btn-primary w-full">{loading?'Signing in...':'Sign in'}</button>
          </div>
          <p className="text-sm text-slate-400 mt-6 text-center">
            Don't have an account? <Link to="/register" className="text-neon">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
