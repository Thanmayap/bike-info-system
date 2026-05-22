import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ email:'', otp:'', password:'' });

  const send = async () => {
    try { await api.post('/auth/forgot-password', { email:data.email }); toast.success('OTP sent'); setStep(2); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };
  const verify = async () => {
    try { await api.post('/auth/verify-otp', { email:data.email, otp:data.otp }); setStep(3); }
    catch (e) { toast.error(e.response?.data?.message || 'Invalid OTP'); }
  };
  const reset = async () => {
    try { await api.post('/auth/reset-password', data); toast.success('Password reset'); setStep(4); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        {step===1 && (
          <div className="space-y-4 mt-6">
            <input type="email" placeholder="Email" value={data.email} onChange={e=>setData({...data,email:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <button onClick={send} className="btn btn-primary w-full">Send OTP</button>
          </div>
        )}
        {step===2 && (
          <div className="space-y-4 mt-6">
            <input placeholder="Enter OTP" value={data.otp} onChange={e=>setData({...data,otp:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <button onClick={verify} className="btn btn-primary w-full">Verify</button>
          </div>
        )}
        {step===3 && (
          <div className="space-y-4 mt-6">
            <input type="password" placeholder="New password" value={data.password} onChange={e=>setData({...data,password:e.target.value})}
                   className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"/>
            <button onClick={reset} className="btn btn-primary w-full">Reset password</button>
          </div>
        )}
        {step===4 && <p className="text-slate-400 mt-6">Password reset successful. <Link to="/login" className="text-neon">Login</Link></p>}
      </div>
    </div>
  );
}
