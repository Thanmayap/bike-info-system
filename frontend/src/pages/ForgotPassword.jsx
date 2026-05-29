import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';

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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass p-8 w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-slate-400 mt-1">Reset your account password using OTP</p>
        </div>
        
        {step===1 && (
          <div className="space-y-4 mt-6">
            <input type="text" placeholder="Email address or Phone number" value={data.identifier} 
                   onChange={e=>setData({...data,identifier:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
            <button disabled={loading} onClick={send} className="btn btn-primary w-full">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}
        {step===2 && (
          <div className="space-y-4 mt-6">
            <p className="text-xs text-yellow-400 bg-yellow-400/5 p-2 rounded border border-yellow-400/10">
              💡 <b>Dev Fallback</b>: Check the backend console terminal for the OTP if your email/SMS credentials aren't configured.
            </p>
            <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={data.otp} 
                   onChange={e=>setData({...data,otp:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-center tracking-widest text-lg font-bold text-white"/>
            <button disabled={loading} onClick={verify} className="btn btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
        {step===3 && (
          <div className="space-y-4 mt-6">
            <input type="password" placeholder="New password" value={data.password} 
                   onChange={e=>setData({...data,password:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
            <button disabled={loading} onClick={reset} className="btn btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </div>
        )}
        {step===4 && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-slate-300">Password reset successful!</p>
            <Link to="/login" className="btn btn-primary block text-center">Login Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
