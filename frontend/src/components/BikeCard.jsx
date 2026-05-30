import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Star, Compass, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCompare } from '../context/CompareContext.jsx';

const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `${window.location.origin}/_/backend` : 'http://localhost:5000');
  return `${baseUrl}${image}`;
};

export default function BikeCard({ bike }) {
  const { activeCity } = useLocation();
  const { t } = useLanguage();
  const { selectedBikes, toggleCompare } = useCompare();
  const [selectedColor, setSelectedColor] = useState(null);
  
  let colorsList = [];
  if (bike.colors) {
    try {
      colorsList = JSON.parse(bike.colors);
    } catch(e) {}
  }

  useEffect(() => {
    if (colorsList.length > 0) {
      setSelectedColor(colorsList[0]);
    } else {
      setSelectedColor(null);
    }
  }, [bike.colors]);

  const img = getImageSrc(bike.image);

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }} 
      className="glass overflow-hidden group flex flex-col justify-between border border-slate-200 dark:border-white/5 bg-white/70 dark:bg-white/[0.02] hover:bg-white/90 dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/10 rounded-[20px] transition-all duration-300 shadow-md shadow-slate-200/50 dark:shadow-black/20"
    >
      <Link to={`/bikes/${bike.id}`} className="flex flex-col h-full">
        {/* Transparent centered Render with soft shadow */}
        <div className="aspect-[1.5] bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-white/[0.01] dark:to-black/20 relative overflow-hidden flex items-center justify-center p-4">
          
          {/* Floor Shadow Glow */}
          <div className="absolute bottom-3 w-3/4 h-2.5 bg-black/60 rounded-[100%] blur-[4px] group-hover:scale-x-95 transition-all duration-300" />
          
          {bike.image ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={img}
                alt={bike.model}
                className="w-full max-h-[140px] object-contain group-hover:scale-105 transition-transform duration-500 filter brightness-[1.02]"
                onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'; }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🏍️</div>
          )}

          {bike.is_featured ? (
            <span className="absolute top-3 left-3 text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-neon/15 border border-emerald-300 dark:border-neon/30 text-emerald-700 dark:text-neon rounded font-bold uppercase tracking-wider z-10">
              {t('featuredBadge')}
            </span>
          ) : null}

          {/* EV Badge */}
          {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric'))) && (
            <span className="absolute bottom-9 left-3 flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#0a2b26] border border-[#238b78] text-[#38e6c8] rounded-[4px] font-bold tracking-wider z-10 shadow-sm shadow-black/50">
              <Zap size={10} className="fill-[#38e6c8] text-[#38e6c8]" /> EV
            </span>
          )}

          {/* Compare Checkbox */}
          <div 
            className="absolute bottom-3 left-3 flex items-center gap-2 z-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(bike.id);
            }}
          >
            <input 
              type="checkbox"
              checked={selectedBikes.includes(bike.id)}
              readOnly
              className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-400 bg-transparent checked:bg-neon checked:border-neon cursor-pointer appearance-none flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-sm checked:after:block after:hidden"
            />
            <span className="text-[12px] text-slate-500 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Compare</span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">{bike.brand}</div>
            <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-neon transition-colors leading-snug">{bike.model}</div>
            
            {/* Localized Price and details matching reference layout */}
            <div className="pt-2">
              <div className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1">
                ₹{Number(bike.price).toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 normal-case">{t('onwards')}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t('exShowroom')} <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeCity}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Specs bar */}
            <div className="flex items-center gap-4 text-[10px] text-slate-600 dark:text-slate-400 border-t border-b border-slate-200 dark:border-white/5 py-2">
              <span className="flex items-center gap-1 font-semibold"><Gauge size={11} className="text-neon" /> {bike.engine_cc ? `${bike.engine_cc} cc` : 'EV'}</span>
              <span className="flex items-center gap-1 font-semibold"><Fuel size={11} className="text-neon" /> {bike.mileage} {bike.engine_cc ? 'kmpl' : 'km'}</span>
              {bike.avg_rating ? (
                <span className="flex items-center gap-0.5 font-semibold text-amber-400"><Star size={11} className="fill-amber-400" /> {Number(bike.avg_rating).toFixed(1)}</span>
              ) : null}
            </div>

            {/* Colors picker or Check price button */}
            <div className="flex flex-col gap-2.5 pt-1">
              {/* "Check on-road price" styled outline CTA */}
              <button 
                type="button" 
                className="w-full py-2.5 text-center text-xs font-bold text-emerald-700 dark:text-neon hover:text-white dark:hover:text-ink-950 bg-emerald-50 dark:bg-neon/5 hover:bg-emerald-600 dark:hover:bg-neon border border-emerald-200 dark:border-neon/30 hover:border-emerald-600 dark:hover:border-neon dark:hover:shadow-glow rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass size={12} />
                {t('checkOnRoadPrice')}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

