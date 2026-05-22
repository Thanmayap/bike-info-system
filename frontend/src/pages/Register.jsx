import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created');
      nav('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold">Create account</h1>
        <div className="space-y-4 mt-6">
          {['name','email','phone','password'].map(f => (
            <input key={f} type={f==='password'?'password':f==='email'?'email':'text'} required={f!=='phone'}
                   placeholder={f[0].toUpperCase()+f.slice(1)} value={form[f]}
                   onChange={e=>setForm({...form,[f]:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
          ))}
          <button className="btn btn-primary w-full">Sign up</button>
        </div>
        <p className="text-sm text-slate-400 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-neon">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
