import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client';

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
    const val = form[field];
    if (!val) return toast.error(`Please enter your ${field}`);
    if (field === 'email' && !val.includes('@')) return toast.error('Please enter a valid email');

    if (field === 'email') setEmailLoading(true);
    else setPhoneLoading(true);

    try {
      await api.post('/auth/send-otp', { identifier: val, purpose: 'register' });
      toast.success(`OTP sent to your ${field}!`);
      if (field === 'email') {
        setEmailOtpSent(true);
        startEmailTimer();
      } else {
        setPhoneOtpSent(true);
        startPhoneTimer();
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
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="glass p-8 w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-slate-400 mt-1">Register to start using BikeIQ</p>
        </div>
        
        <div className="space-y-4">
          {/* Name field */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Full Name</label>
            <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                   placeholder="John Doe" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
          </div>

          {/* Email field with verification */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Email Address</label>
            <div className="flex gap-2">
              <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                     placeholder="email@example.com" disabled={emailOtpSent}
                     className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white disabled:opacity-60"/>
              <button type="button" disabled={emailLoading || emailTimer > 0 || !form.email}
                      onClick={() => sendOtpRequest('email')}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-xs font-semibold rounded-lg border border-white/10 text-white transition-all whitespace-nowrap">
                {emailLoading ? 'Sending...' : emailTimer > 0 ? `Resend (${emailTimer}s)` : emailOtpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>
            {emailOtpSent && (
              <div className="mt-2">
                <input type="text" required value={emailOtp} onChange={e=>setEmailOtp(e.target.value)}
                       maxLength={6} placeholder="Enter 6-digit Email OTP"
                       className="w-full px-3 py-2 bg-neon/5 border border-neon/30 text-neon rounded-lg focus:outline-none text-center tracking-widest font-bold"/>
                <p className="text-[10px] text-yellow-400 mt-1">
                  💡 Check backend console logs if SMTP fails in local development.
                </p>
              </div>
            )}
          </div>

          {/* Phone field with verification */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Phone Number (Optional)</label>
            <div className="flex gap-2">
              <input type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                     placeholder="e.g. +1234567890" disabled={phoneOtpSent}
                     className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white disabled:opacity-60"/>
              {form.phone && (
                <button type="button" disabled={phoneLoading || phoneTimer > 0}
                        onClick={() => sendOtpRequest('phone')}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-xs font-semibold rounded-lg border border-white/10 text-white transition-all whitespace-nowrap">
                  {phoneLoading ? 'Sending...' : phoneTimer > 0 ? `Resend (${phoneTimer}s)` : phoneOtpSent ? 'Resend' : 'Send OTP'}
                </button>
              )}
            </div>
            {phoneOtpSent && (
              <div className="mt-2">
                <input type="text" required value={phoneOtp} onChange={e=>setPhoneOtp(e.target.value)}
                       maxLength={6} placeholder="Enter 6-digit Phone OTP"
                       className="w-full px-3 py-2 bg-neon/5 border border-neon/30 text-neon rounded-lg focus:outline-none text-center tracking-widest font-bold"/>
                <p className="text-[10px] text-yellow-400 mt-1">
                  💡 Check backend console logs for the SMS OTP.
                </p>
              </div>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Password</label>
            <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                   placeholder="Create password" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon/50 text-white"/>
          </div>

          <button disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>
        </div>

        <p className="text-sm text-slate-400 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-neon font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
