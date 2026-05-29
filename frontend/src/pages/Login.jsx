import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client';

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
        <div className="glass p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1 mb-6">Login to your account</p>

          <div className="flex border-b border-white/10 mb-6">
            <button type="button" onClick={() => setLoginMode('password')}
                    className={`flex-1 pb-2 text-center font-medium border-b-2 transition-all ${loginMode === 'password' ? 'border-neon text-white font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              Password
            </button>
            <button type="button" onClick={() => setLoginMode('otp')}
                    className={`flex-1 pb-2 text-center font-medium border-b-2 transition-all ${loginMode === 'otp' ? 'border-neon text-white font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              OTP Sign In
            </button>
          </div>

          {loginMode === 'password' ? (
            <form onSubmit={submit} className="space-y-4">
              <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                     placeholder="Email" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
              <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                     placeholder="Password" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
              <Link to="/forgot-password" className="text-sm text-neon block text-right">Forgot password?</Link>
              <button disabled={loading} className="btn btn-primary w-full mt-2">{loading?'Signing in...':'Sign in'}</button>
            </form>
          ) : (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="flex bg-white/5 p-1 rounded-lg gap-1 text-xs mb-2">
                    <button type="button" onClick={() => { setOtpMethod('email'); setOtpIdentifier(''); }}
                            className={`flex-1 py-1.5 text-center rounded-md font-medium transition-all ${otpMethod === 'email' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      Email
                    </button>
                    <button type="button" onClick={() => { setOtpMethod('phone'); setOtpIdentifier(''); }}
                            className={`flex-1 py-1.5 text-center rounded-md font-medium transition-all ${otpMethod === 'phone' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      Phone Number
                    </button>
                  </div>
                  {otpMethod === 'email' ? (
                    <input type="email" required value={otpIdentifier}
                           onChange={e=>setOtpIdentifier(e.target.value)}
                           placeholder="email@example.com"
                           className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
                  ) : (
                    <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-neon/50 transition-all">
                      <span className="px-3 py-2 text-slate-400 border-r border-white/10 bg-white/5 text-sm select-none font-medium flex items-center">+91</span>
                      <input type="tel" required value={otpIdentifier}
                             onChange={e => {
                               const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                               setOtpIdentifier(raw);
                             }}
                             placeholder="10-digit Indian number"
                             className="w-full px-3 py-2 bg-transparent focus:outline-none text-white text-sm font-medium"/>
                    </div>
                  )}
                  <button disabled={loading} className="btn btn-primary w-full mt-2">{loading?'Sending OTP...':'Send OTP'}</button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-sm text-slate-300">
                    We sent a 6-digit OTP code to <b className="text-white">{otpIdentifier}</b>.
                  </p>
                  <p className="text-xs text-yellow-400/80 bg-yellow-400/5 p-2 rounded border border-yellow-400/10">
                    💡 <b>Dev Fallback</b>: If your email/SMS credentials aren't configured, check the backend console terminal for the OTP.
                  </p>
                  <input type="text" required value={otpCode} onChange={e=>setOtpCode(e.target.value)}
                         maxLength={6} placeholder="Enter 6-digit OTP"
                         className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-center tracking-widest text-lg font-bold text-white"/>
                  
                  <div className="flex justify-between items-center text-sm">
                    <button type="button" onClick={() => { setOtpStep(1); setOtpCode(''); }} className="text-slate-400 hover:text-white transition">
                      Change {otpMethod === 'email' ? 'Email' : 'Phone'}
                    </button>
                    {countdown > 0 ? (
                      <span className="text-slate-400">Resend in {countdown}s</span>
                    ) : (
                      <button type="button" onClick={handleSendOtp} className="text-neon hover:underline font-medium">
                        Resend OTP
                      </button>
                    )}
                  </div>
                  
                  <button disabled={loading} className="btn btn-primary w-full mt-2">{loading?'Verifying...':'Verify & Sign In'}</button>
                </form>
              )}
            </div>
          )}

          <p className="text-sm text-slate-400 mt-6 text-center">
            Don't have an account? <Link to="/register" className="text-neon font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
