import { useState } from 'react';
import { X, Search, Compass, MapPin, LocateFixed } from 'lucide-react';
import { useLocation } from '../context/LocationContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import toast from 'react-hot-toast';

const citiesList = [
  {
    name: "Mumbai",
    pincode: "400001",
    // Gateway of India SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M20 45 L20 20 L32 20 L32 45 M68 45 L68 20 L80 20 L80 45 M32 20 L68 20 M32 15 L68 15 L68 20 L32 20 Z" />
        <path d="M38 45 C 38 27, 62 27, 62 45" />
        <rect x="42" y="10" width="16" height="5" />
        <circle cx="50" cy="7" r="1.5" className="fill-neon" />
      </svg>
    )
  },
  {
    name: "Bangalore",
    pincode: "560001",
    // Vidhana Soudha SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M5 45 L95 45 M15 45 L15 25 L85 25 L85 45 M25 25 L25 15 L75 15 L75 25" />
        <path d="M42 15 L42 10 L58 10 L58 15 M46 10 C 46 3, 54 3, 54 10 Z" />
        <line x1="50" y1="3" x2="50" y2="0" />
        <rect x="47" y="25" width="6" height="20" />
      </svg>
    )
  },
  {
    name: "Delhi",
    pincode: "110001",
    // India Gate SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M15 45 L85 45 M25 45 L25 10 L38 10 L38 45 M62 45 L62 10 L75 10 L75 45 M38 10 L62 10 M30 18 L70 18 M30 14 L70 14" />
        <path d="M38 45 C 38 22, 62 22, 62 45" />
        <path d="M35 10 C 35 5, 65 5, 65 10 Z" />
      </svg>
    )
  },
  {
    name: "Pune",
    pincode: "411001",
    // Shaniwar Wada Gate SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M20 45 L20 15 L35 15 L35 45 M65 45 L65 15 L80 15 L80 45 M35 25 L65 25 M35 15 L65 15 M30 10 L70 10 L70 15 L30 15 Z" />
        <path d="M42 45 C 42 35, 58 35, 58 45" />
      </svg>
    )
  },
  {
    name: "Navi Mumbai",
    pincode: "400703",
    // CIDCO Modern Dome SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M25 45 C 25 12, 75 12, 75 45 Z" />
        <path d="M38 45 C 38 32, 62 32, 62 45" />
        <line x1="50" y1="12" x2="50" y2="45" />
      </svg>
    )
  },
  {
    name: "Hyderabad",
    pincode: "500001",
    // Charminar SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M15 45 L85 45 M30 45 L30 18 L70 18 L70 45 M30 24 L70 24 M30 32 L70 32" />
        <path d="M40 45 C 40 30, 60 30, 60 45" />
        {/* Minarets */}
        <path d="M22 45 L22 5 L28 5 L28 45" />
        <path d="M72 45 L72 5 L78 5 L78 45" />
        <circle cx="25" cy="3" r="1.5" className="fill-neon" />
        <circle cx="75" cy="3" r="1.5" className="fill-neon" />
      </svg>
    )
  },
  {
    name: "Ahmedabad",
    pincode: "380001",
    // Stylized Sabarmati Ashram SVG
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M25 45 L40 25 L55 45 M50 45 L62 28 L74 45 M20 45 L20 38 L30 38" />
        <circle cx="48" cy="20" r="1" className="fill-neon" />
      </svg>
    )
  },
  {
    name: "Chennai",
    pincode: "600001",
    // Stylized Ripon Dome building SVG
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M20 45 L20 22 L80 22 L80 45 M30 22 L30 12 L70 12 L70 22 M44 12 C 44 4, 56 4, 56 12 Z" />
        <rect x="47" y="22" width="6" height="23" />
      </svg>
    )
  },
  {
    name: "Kolkata",
    pincode: "700001",
    // Victoria Memorial SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M10 45 L90 45 M20 45 L20 25 L80 25 L80 45 M30 25 C 30 10, 70 10, 70 25" />
        <path d="M44 15 C 44 8, 56 8, 56 15 Z" />
        <line x1="50" y1="8" x2="50" y2="4" />
        <circle cx="50" cy="3" r="1" className="fill-neon" />
        <rect x="25" y="25" width="6" height="20" />
        <rect x="69" y="25" width="6" height="20" />
      </svg>
    )
  },
  {
    name: "Chandigarh",
    pincode: "160017",
    // Open Hand Monument SVG Outline
    icon: (
      <svg viewBox="0 0 100 50" className="w-16 h-10 stroke-neon fill-none stroke-[1.5] transition-all group-hover:fill-neon/5 duration-300">
        <path d="M50 45 L50 25 M38 45 L62 45" />
        <path d="M50 25 C 42 25, 30 20, 30 15 C 30 10, 38 12, 42 16 C 44 18, 48 20, 50 18 C 52 14, 56 8, 62 8 C 68 8, 66 14, 60 18 C 58 20, 56 22, 56 25 Z" />
      </svg>
    )
  }
];

export default function LocationModal({ onClose }) {
  const { activeCity, selectCity, detectLocation } = useLocation();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (city, pincode) => {
    selectCity(city, pincode);
    toast.success(`${t('locationGranted')} - ${city}`);
    onClose();
  };

  const handleDetect = async () => {
    setLoading(true);
    const loadToast = toast.loading(t('detecting'));
    try {
      const res = await detectLocation();
      toast.success(`${t('locationGranted')} (${res.city})`, { id: loadToast });
      onClose();
    } catch (err) {
      toast.error(t('gpsError'), { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Check if search matches city name or pin
    const match = citiesList.find(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.pincode.includes(searchTerm.trim())
    );

    if (match) {
      handleSelect(match.name, match.pincode);
    } else {
      // Create user-defined custom city
      const word = searchTerm.trim();
      const isNum = /^\d+$/.test(word);
      const customCity = isNum ? `Area (Pin ${word})` : word.charAt(0).toUpperCase() + word.slice(1);
      handleSelect(customCity, isNum ? word : '');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative border border-white/10 shadow-2xl shadow-neon/15 rounded-3xl animate-slideUp custom-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="text-neon" size={20} /> {t('selectCity')}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Search & GPS */}
        <div className="mt-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 relative items-center">
            <div className="flex-1 flex items-center gap-3 px-4 bg-white/5 border border-white/10 focus-within:border-neon focus-within:bg-white/10 rounded-2xl transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('pincodePlaceholder')} 
                className="w-full bg-transparent py-3.5 outline-none text-white text-sm"
              />
            </div>
            <button type="submit" className="px-5 py-3.5 bg-neon hover:bg-neon-glow hover:shadow-glow text-ink-950 font-bold rounded-2xl text-sm transition-all cursor-pointer">
              {t('searchBtn')}
            </button>
          </form>

          {/* GPS Detector */}
          <button 
            type="button" 
            onClick={handleDetect}
            disabled={loading}
            className="flex items-center gap-2 mt-2 text-sm font-semibold text-sky-500 hover:text-sky-400 hover:underline transition cursor-pointer disabled:opacity-50"
          >
            <LocateFixed size={16} className={loading ? "animate-spin" : ""} />
            {loading ? t('detecting') : "Detect my location"}
          </button>
        </div>

        {/* Popular Cities list */}
        <div className="mt-6">
          <h3 className="text-xs text-slate-400 uppercase tracking-widest font-extrabold mb-4">{t('popularCities')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {citiesList.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelect(city.name, city.pincode)}
                className={`group bg-slate-800 py-4 flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer rounded-2xl ${
                  activeCity === city.name 
                    ? 'border-neon bg-neon/10 shadow-lg shadow-neon/10 scale-105' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {city.icon}
                <span className={`text-xs font-bold transition ${activeCity === city.name ? 'text-neon' : 'text-slate-300 group-hover:text-white'}`}>
                  {city.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
