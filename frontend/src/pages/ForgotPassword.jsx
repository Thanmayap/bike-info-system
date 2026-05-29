import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ identifier:'', otp:'', password:'' });
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!data.identifier) return toast.error('Please enter your email or phone number');
    setLoading(true);
    try { 
      const { data: resData } = await api.post('/auth/forgot-password', { identifier: data.identifier }); 
      toast.success('OTP sent successfully!'); 
      setStep(2); 
      if (resData.devOtp) {
        toast(`[DEV MODE] Auto-filled OTP: ${resData.devOtp}`, { icon: '🔑', duration: 5000 });
        setData(prev => ({ ...prev, otp: resData.devOtp }));
      }
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Failed to send OTP'); 
    } finally {
      setLoading(false);
    }
  };
  const verify = async () => {
    if (!data.otp) return toast.error('Please enter the OTP');
    setLoading(true);
    try { 
      await api.post('/auth/verify-otp', { identifier: data.identifier, otp: data.otp }); 
      setStep(3); 
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Invalid or expired OTP'); 
    } finally {
      setLoading(false);
    }
  };
  const reset = async () => {
    if (!data.password) return toast.error('Please enter a new password');
    setLoading(true);
    try { 
      await api.post('/auth/reset-password', { 
        identifier: data.identifier, 
        otp: data.otp, 
        password: data.password 
      }); 
      toast.success('Password reset successfully!'); 
      setStep(4); 
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Failed to reset password'); 
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
              Get back<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">on the road.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-300 text-lg max-w-sm"
            >
              Reset your password to regain access to your motorcycle comparison dashboard.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side: Forgot Password Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="p-10 lg:p-16 flex flex-col justify-center relative bg-ink-900/40 backdrop-blur-md"
        >
          <div className="w-full max-w-sm mx-auto">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h1 className="text-3xl font-bold text-white tracking-tight">Forgot password</h1>
              <p className="text-slate-400 mt-2 mb-8">Reset your account password using OTP.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Identifier</label>
                    <input type="text" placeholder="Email address or Phone number" value={data.identifier} 
                           onChange={e=>setData({...data,identifier:e.target.value})}
                           className="w-full px-4 py-3 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
                  </div>
                  <button disabled={loading} onClick={send} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mb-6">
                    <p className="text-sm text-emerald-200">
                      OTP sent to <br/><b className="text-white text-base mt-1 block">{data.identifier}</b>
                    </p>
                  </div>
                  <p className="text-xs text-yellow-400 bg-yellow-400/5 p-2 rounded border border-yellow-400/10 text-center">
                    💡 <b>Dev Fallback</b>: Check the backend console for the OTP.
                  </p>
                  <div>
                    <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={data.otp} 
                           onChange={e=>setData({...data,otp:e.target.value})}
                           className="w-full px-4 py-4 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-center tracking-[0.5em] text-2xl font-bold text-neon transition-all"/>
                  </div>
                  <button disabled={loading} onClick={verify} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">New Password</label>
                    <input type="password" placeholder="Enter new password" value={data.password} 
                           onChange={e=>setData({...data,password:e.target.value})}
                           className="w-full px-4 py-3 bg-ink-950/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/50 text-white transition-all"/>
                  </div>
                  <button disabled={loading} onClick={reset} className="w-full py-3.5 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                    {loading ? 'Resetting...' : 'Reset password'}
                  </button>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="text-xl font-bold text-white">Password Reset!</p>
                  <p className="text-slate-400 text-sm">Your password has been successfully updated.</p>
                  <Link to="/login" className="w-full inline-block py-3.5 mt-4 bg-neon hover:bg-[#25c4a6] text-ink-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,230,200,0.3)] transition-all transform hover:-translate-y-0.5">
                    Login Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 4 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-slate-500 mt-10 text-center font-medium">
                Remember your password? <Link to="/login" className="text-white font-bold hover:text-neon transition-colors border-b border-transparent hover:border-neon pb-0.5">Back to Login</Link>
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
