import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client';
import { motion } from 'framer-motion';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const startEmailTimer = () => {
    setEmailTimer(60);
    const interval = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const startPhoneTimer = () => {
    setPhoneTimer(60);
    const interval = setInterval(() => {
      setPhoneTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtpRequest = async (field) => {
    let val = form[field];
    if (!val) return toast.error(`Please enter your ${field}`);
    if (field === 'email' && !val.includes('@')) return toast.error('Please enter a valid email');
    if (field === 'phone') {
      if (val.length !== 10) return toast.error('Please enter a valid 10-digit Indian phone number');
      val = '+91' + val;
    }

    if (field === 'email') setEmailLoading(true);
    else setPhoneLoading(true);

    try {
      const { data } = await api.post('/auth/send-otp', { identifier: val, purpose: 'register' });
      toast.success(`OTP sent to your ${field}!`);
      if (field === 'email') {
        setEmailOtpSent(true);
        startEmailTimer();
        if (data.devOtp) {
          toast(`[DEV MODE] Auto-filled OTP: ${data.devOtp}`, { icon: '🔑', duration: 5000 });
          setEmailOtp(data.devOtp);
        }
      } else {
        setPhoneOtpSent(true);
        startPhoneTimer();
        if (data.devOtp) {
          toast(`[DEV MODE] Auto-filled OTP: ${data.devOtp}`, { icon: '🔑', duration: 5000 });
          setPhoneOtp(data.devOtp);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to send OTP to ${field}`);
    } finally {
      if (field === 'email') setEmailLoading(false);
      else setPhoneLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!emailOtpSent) return toast.error('Please verify your email with OTP first');
    if (!emailOtp) return toast.error('Please enter the email OTP');
    if (form.phone && !phoneOtpSent) return toast.error('Please verify your phone number with OTP first');
    if (form.phone && !phoneOtp) return toast.error('Please enter the phone OTP');

    setLoading(true);
    try {
      await register({
        ...form,
        phone: form.phone ? '+91' + form.phone : undefined,
        emailOtp,
        phoneOtp: form.phone ? phoneOtp : undefined
      });
      toast.success('Account created successfully!');
      nav('/dashboard');
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to create account'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ink-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-neon/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-2xl shadow-neon/10 border border-white/10 z-10 mx-4 relative glass">
        
        {/* Left Side: Brand and Imagery */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex relative p-12 flex-col justify-between"
        >
          <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=80" className="absolute inset-0 w-full h-full object-cover rounded-l-[2rem] opacity-40 mix-blend-overlay"/>
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 to-ink-950/40 rounded-l-[2rem]"/>
          
          <div className="relative z-10 flex items-center gap-2 font-display font-black text-2xl text-white">
            <span className="text-neon animate-pulse text-3xl">🏍️</span> BikeIQ
          </div>

          <div className="relative z-10 mt-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-black text-white leading-tight mb-4"
            >
              Start your<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">journey</span> here.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-300 text-lg max-w-sm"
            >
              Create an account to compare bikes, track prices, and get intelligent recommendations.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="p-8 lg:p-12 flex flex-col justify-center relative bg-ink-900/40 backdrop-blur-md overflow-y-auto max-h-[90vh]"
        >
          <div className="w-full max-w-sm mx-auto">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
              <p className="text-slate-400 mt-2 mb-6">Register to start using BikeIQ.</p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onSubmit={submit} className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                       placeholder="John Doe" 
                       className="w-full px-4 py-2.5 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                <div className="flex gap-2">
                  <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                         placeholder="you@example.com" disabled={emailOtpSent}
                         className="flex-1 w-full px-4 py-2.5 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white disabled:opacity-60 transition-all"/>
                  <button type="button" disabled={emailLoading || emailTimer > 0 || !form.email}
                          onClick={() => sendOtpRequest('email')}
                          className="px-4 py-2.5 bg-neon/10 hover:bg-neon/20 disabled:opacity-50 text-xs font-bold rounded-xl border border-neon/30 text-neon transition-all whitespace-nowrap">
                    {emailLoading ? 'Sending...' : emailTimer > 0 ? `Wait (${emailTimer}s)` : emailOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {emailOtpSent && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                    <input type="text" required value={emailOtp} onChange={e=>setEmailOtp(e.target.value)}
                           maxLength={6} placeholder="Enter 6-digit OTP"
                           className="w-full px-4 py-2.5 bg-ink-950/80 border border-neon text-neon rounded-xl focus:outline-none text-center tracking-[0.3em] font-bold shadow-[0_0_10px_rgba(56,230,200,0.1)]"/>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number (Optional)</label>
                <div className="flex gap-2">
                  <div className="flex bg-ink-950/50 border border-white/10 rounded-xl overflow-hidden flex-1 focus-within:border-neon focus-within:ring-1 focus-within:ring-neon/50 transition-all">
                    <span className="px-4 py-2.5 text-slate-400 border-r border-white/10 bg-black/20 text-sm font-bold flex items-center">+91</span>
                    <input type="tel" value={form.phone} 
                           onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                           placeholder="10-digit number" disabled={phoneOtpSent}
                           className="w-full px-4 py-2.5 bg-transparent focus:outline-none text-white disabled:opacity-60 text-sm font-medium"/>
                  </div>
                  {form.phone && form.phone.length === 10 && (
                    <button type="button" disabled={phoneLoading || phoneTimer > 0}
                            onClick={() => sendOtpRequest('phone')}
                            className="px-4 py-2.5 bg-neon/10 hover:bg-neon/20 disabled:opacity-50 text-xs font-bold rounded-xl border border-neon/30 text-neon transition-all whitespace-nowrap">
                      {phoneLoading ? 'Sending...' : phoneTimer > 0 ? `Wait (${phoneTimer}s)` : phoneOtpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                </div>
                {phoneOtpSent && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                    <input type="text" required value={phoneOtp} onChange={e=>setPhoneOtp(e.target.value)}
                           maxLength={6} placeholder="Enter Phone OTP"
                           className="w-full px-4 py-2.5 bg-ink-950/80 border border-neon text-neon rounded-xl focus:outline-none text-center tracking-[0.3em] font-bold shadow-[0_0_10px_rgba(56,230,200,0.1)]"/>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                       placeholder="Create secure password" 
                       className="w-full px-4 py-2.5 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
              </div>

              <button disabled={loading || (form.phone && form.phone.length > 0 && (!phoneOtpSent || !phoneOtp))} 
                      className="w-full py-3.5 mt-4 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none">
                {loading ? 'Creating Account...' : (form.phone && form.phone.length > 0 && !phoneOtpSent) ? 'Verify Phone to continue' : 'Sign Up securely'}
              </button>
            </motion.form>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-slate-500 mt-6 text-center font-medium">
              Already have an account? <Link to="/login" className="text-white font-bold hover:text-neon transition-colors border-b border-transparent hover:border-neon pb-0.5">Sign in</Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
