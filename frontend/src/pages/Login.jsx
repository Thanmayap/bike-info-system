import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { login, loginWithOtp } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  // OTP State
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [otpMethod, setOtpMethod] = useState('email'); // 'email' | 'phone'
  const [otpStep, setOtpStep] = useState(1); // 1 | 2
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startTimer = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    let identifier = otpIdentifier;
    if (!identifier) return toast.error('Please enter your ' + (otpMethod === 'email' ? 'email' : 'phone number'));
    if (otpMethod === 'phone') {
      if (identifier.length !== 10) return toast.error('Please enter a valid 10-digit Indian phone number');
      identifier = '+91' + identifier;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/send-otp', { identifier, purpose: 'login' });
      toast.success('OTP sent successfully!');
      setOtpStep(2);
      startTimer();
      if (data.devOtp) {
        toast(`[DEV MODE] Auto-filled OTP: ${data.devOtp}`, { icon: '🔑', duration: 5000 });
        setOtpCode(data.devOtp);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return toast.error('Please enter the OTP');
    let identifier = otpIdentifier;
    if (otpMethod === 'phone') {
      identifier = '+91' + identifier;
    }
    setLoading(true);
    try {
      const u = await loginWithOtp(identifier, otpCode);
      toast.success('Welcome back!');
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

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
            <Bike className="text-neon" size={32}/> BikeIQ
          </div>

          <div className="relative z-10 mt-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-black text-white leading-tight mb-4"
            >
              Ignite your<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">passion</span> to ride.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-300 text-lg max-w-sm"
            >
              Experience the world's most intelligent motorcycle comparison platform.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="p-10 lg:p-16 flex flex-col justify-center relative bg-ink-900/40 backdrop-blur-md"
        >
          <div className="w-full max-w-sm mx-auto">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-slate-400 mt-2 mb-8">Enter your details to access your dashboard.</p>
            </motion.div>

            <div className="flex bg-ink-950/50 p-1.5 rounded-xl border border-white/5 mb-8">
              <button type="button" onClick={() => setLoginMode('password')}
                      className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${loginMode === 'password' ? 'bg-neon text-ink-950 shadow-[0_0_15px_rgba(56,230,200,0.3)]' : 'text-slate-400 hover:text-white'}`}>
                Password
              </button>
              <button type="button" onClick={() => setLoginMode('otp')}
                      className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${loginMode === 'otp' ? 'bg-neon text-ink-950 shadow-[0_0_15px_rgba(56,230,200,0.3)]' : 'text-slate-400 hover:text-white'}`}>
                OTP Sign In
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loginMode === 'password' ? (
                <motion.form 
                  key="password"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={submit} className="space-y-5"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                    <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                           placeholder="Enter your email" 
                           className="w-full px-4 py-3 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                      <Link to="/forgot-password" className="text-xs text-neon hover:text-white transition-colors font-medium">Forgot?</Link>
                    </div>
                    <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                           placeholder="••••••••" 
                           className="w-full px-4 py-3 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
                  </div>
                  <button disabled={loading} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] hover:shadow-[0_0_25px_rgba(56,230,200,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
                    {loading ? 'Authenticating...' : 'Sign In securely'}
                  </button>
                </motion.form>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {otpStep === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                      <div className="flex bg-ink-950/50 p-1 rounded-lg gap-1 text-xs mb-4">
                        <button type="button" onClick={() => { setOtpMethod('email'); setOtpIdentifier(''); }}
                                className={`flex-1 py-2 text-center rounded-md font-bold uppercase tracking-wider transition-all ${otpMethod === 'email' ? 'bg-white/10 text-neon' : 'text-slate-500 hover:text-slate-300'}`}>
                          Email
                        </button>
                        <button type="button" onClick={() => { setOtpMethod('phone'); setOtpIdentifier(''); }}
                                className={`flex-1 py-2 text-center rounded-md font-bold uppercase tracking-wider transition-all ${otpMethod === 'phone' ? 'bg-white/10 text-neon' : 'text-slate-500 hover:text-slate-300'}`}>
                          Phone
                        </button>
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{otpMethod === 'email' ? 'Email Address' : 'Phone Number'}</label>
                        {otpMethod === 'email' ? (
                          <input type="email" required value={otpIdentifier}
                                 onChange={e=>setOtpIdentifier(e.target.value)}
                                 placeholder="you@example.com"
                                 className="w-full px-4 py-3 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
                        ) : (
                          <div className="flex bg-ink-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-neon focus-within:ring-1 focus-within:ring-neon/50 transition-all">
                            <span className="px-4 py-3 text-slate-400 border-r border-white/10 bg-black/20 text-sm font-bold flex items-center">+91</span>
                            <input type="tel" required value={otpIdentifier}
                                   onChange={e => setOtpIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                   placeholder="10-digit number"
                                   className="w-full px-4 py-3 bg-transparent focus:outline-none text-white text-sm font-medium"/>
                          </div>
                        )}
                      </div>
                      <button disabled={loading} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                        {loading ? 'Sending Request...' : 'Send Magic Link / OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mb-6">
                        <p className="text-sm text-emerald-200">
                          Verification code sent to <br/><b className="text-white text-base mt-1 block">{otpIdentifier}</b>
                        </p>
                      </div>
                      
                      <div>
                        <input type="text" required value={otpCode} onChange={e=>setOtpCode(e.target.value)}
                               maxLength={6} placeholder="Enter 6-digit code"
                               className="w-full px-4 py-4 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-center tracking-[0.5em] text-2xl font-bold text-neon transition-all"/>
                      </div>
                      
                      <button disabled={loading} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                        {loading ? 'Verifying Identity...' : 'Confirm & Sign In'}
                      </button>

                      <div className="flex justify-between items-center text-xs font-medium pt-2">
                        <button type="button" onClick={() => { setOtpStep(1); setOtpCode(''); }} className="text-slate-400 hover:text-white transition-colors">
                          &larr; Change {otpMethod}
                        </button>
                        {countdown > 0 ? (
                          <span className="text-slate-500">Resend code in {countdown}s</span>
                        ) : (
                          <button type="button" onClick={handleSendOtp} className="text-neon hover:text-white transition-colors">
                            Resend Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-slate-500 mt-10 text-center font-medium">
              New to BikeIQ? <Link to="/register" className="text-white font-bold hover:text-neon transition-colors border-b border-transparent hover:border-neon pb-0.5">Create an account</Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
