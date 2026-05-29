import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Shield, Phone, Mail, Calendar, Key, Save, CheckCircle, Upload } from 'lucide-react';

const avatarPresets = [
  { emoji: "🏍️", name: "Classic Cruiser", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { emoji: "⚡", name: "EV Futuristic", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { emoji: "🚀", name: "Superbike Racer", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { emoji: "🧭", name: "Adventure Trail", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { emoji: "🛠️", name: "Custom Builder", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  { emoji: "🌟", name: "Elite Collector", bg: "bg-violet-500/10 text-violet-400 border-violet-500/20" }
];

export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', avatar: '🏍️' });
  const [pwd, setPwd] = useState({ current: '', next: '' });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isCustomAvatar = profile.avatar && (profile.avatar.startsWith('/') || profile.avatar.startsWith('http'));

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http')) return avatarPath;
    const base = api.defaults.baseURL || '';
    if (base.endsWith('/api')) {
      return base.substring(0, base.length - 4) + avatarPath;
    }
    return avatarPath;
  };

  const handleGrantPermission = () => {
    setShowPermissionModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelPermission = () => {
    setShowPermissionModal(false);
    toast.error('Permission denied. You can still use our themed presets!');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Selected file must be an image.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    const uploadToast = toast.loading('Uploading profile picture...');
    try {
      const res = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.ok) {
        setProfile(prev => ({ ...prev, avatar: res.data.avatar }));
        setUser(u => ({ ...u, avatar: res.data.avatar }));
        toast.success('Profile picture uploaded successfully!', { id: uploadToast });
      } else {
        toast.error('Upload failed.', { id: uploadToast });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading file.', { id: uploadToast });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    api.get('/users/me').then(r => {
      setProfile({
        name: r.data.name || '',
        email: r.data.email || '',
        phone: r.data.phone || '',
        avatar: r.data.avatar || '🏍️'
      });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/me', profile);
      setUser((u) => ({ ...u, name: profile.name, avatar: profile.avatar }));
      toast.success('Profile updated successfully!');
    } catch(err) {
      toast.error('Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  const changePwd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/change-password', pwd);
      toast.success('Password updated successfully!');
      setPwd({ current: '', next: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    }
  };

  const activeAvatar = avatarPresets.find(ap => ap.emoji === profile.avatar) || avatarPresets[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[240px_1fr] gap-8">
      <Sidebar />
      <div className="space-y-8">
        
        {/* State-of-the-Art Profile Header Card */}
        <div className="glass p-6 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 group hover:border-neon/20 transition-all duration-300">
          <div className={`w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-lg shadow-neon/10 transition-transform duration-300 group-hover:scale-105 ${isCustomAvatar ? 'border-neon/40 bg-slate-900' : `${activeAvatar.bg} text-5xl`}`}>
            {isCustomAvatar ? (
              <img 
                src={getAvatarUrl(profile.avatar)} 
                alt="Rider Avatar" 
                className="w-full h-full object-cover" 
              />
            ) : (
              profile.avatar || "🏍️"
            )}
          </div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">{profile.name || "Rider"}</h1>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neon/15 border border-neon/30 text-neon font-bold uppercase tracking-wider">
                <Shield size={10} /> Active Rider
              </span>
            </div>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1"><Phone size={12} className="text-neon" /> {profile.phone || "No phone linked"}</span>
              <span className="flex items-center gap-1"><Mail size={12} className="text-neon" /> {profile.email}</span>
            </div>
          </div>
        </div>

        {/* Action Grids */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Edit Profile Form */}
          <form onSubmit={save} className="glass p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <User className="text-neon" size={18} />
                <h2 className="text-lg font-bold">Personal Details</h2>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Display Name</label>
                <input 
                  value={profile.name} 
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Rider name" 
                  required
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 focus:border-neon focus:bg-white/10 outline-none rounded-xl text-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address (Read-only)</label>
                <input 
                  value={profile.email} 
                  disabled
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm opacity-50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
                <input 
                  value={profile.phone} 
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX" 
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 focus:border-neon focus:bg-white/10 outline-none rounded-xl text-sm transition-all"
                />
              </div>

              {/* Avatar Selector Presets */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Choose Rider Avatar Badge</label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarPresets.map((ap) => (
                    <button
                      key={ap.emoji}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatar: ap.emoji })}
                      className={`h-11 border rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                        profile.avatar === ap.emoji
                          ? 'border-neon bg-neon/10 scale-105 shadow shadow-neon/20'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                      title={ap.name}
                    >
                      {ap.emoji}
                    </button>
                  ))}
                </div>

                {/* Hidden input for local device file picker */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />

                {/* Elegant Upload Trigger Button */}
                <button 
                  type="button" 
                  onClick={() => setShowPermissionModal(true)} 
                  disabled={uploading}
                  className="w-full py-2.5 bg-white/5 border border-dashed border-white/20 hover:border-neon hover:bg-neon/5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={14} className="text-neon" /> {uploading ? 'Processing...' : 'Upload Custom Photo'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Change Password Form */}
          <form onSubmit={changePwd} className="glass p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Key className="text-neon" size={18} />
                <h2 className="text-lg font-bold">Security Credentials</h2>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensure your account stays secure by using a strong, unique password. If you change it here, you will need to use the new credentials on your next login.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Password</label>
                <input 
                  type="password" 
                  required 
                  value={pwd.current} 
                  onChange={e => setPwd({ ...pwd, current: e.target.value })}
                  placeholder="Enter current account password" 
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 focus:border-neon focus:bg-white/10 outline-none rounded-xl text-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  required 
                  value={pwd.next} 
                  onChange={e => setPwd({ ...pwd, next: e.target.value })}
                  placeholder="Enter secure new password" 
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 focus:border-neon focus:bg-white/10 outline-none rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Update Account Password
            </button>
          </form>

        </div>
      </div>

      {/* Security Permission Request Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div className="glass max-w-md w-full p-6 space-y-6 relative border border-white/10 shadow-2xl shadow-neon/10 rounded-2xl transform scale-100 transition-all duration-300 animate-slideUp">
            
            {/* Header Shield Glow Icon */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neon/15 border border-neon/30 flex items-center justify-center text-neon shadow-lg shadow-neon/10 animate-pulse">
                <Shield size={32} className="text-neon" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight text-white">Rider Portal Permission Request</h3>
                <p className="text-[10px] text-neon font-bold uppercase tracking-widest">Security Authorization</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed text-center font-medium">
              Rider Portal requests your permission to access your local photos & storage. This is required to select and upload a custom profile picture. Do you authorize this access?
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="button"
                onClick={handleCancelPermission}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                No, Cancel
              </button>
              <button 
                type="button"
                onClick={handleGrantPermission}
                className="flex-1 px-4 py-2.5 bg-neon/20 hover:bg-neon/30 border border-neon/50 text-neon font-semibold rounded-xl text-sm shadow-md shadow-neon/15 hover:shadow-neon/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={16} /> Yes, Authorize
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
