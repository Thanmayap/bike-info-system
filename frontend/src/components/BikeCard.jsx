import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, IndianRupee, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${image}`;
};

export default function BikeCard({ bike }) {
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
    <motion.div whileHover={{ y: -4 }} className="glass overflow-hidden group">
      <Link to={`/bikes/${bike.id}`}>
        <div className="aspect-[4/3] bg-ink-700 relative overflow-hidden flex items-center justify-center p-3">
          {bike.image
            ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <img
                  src={img}
                  alt={bike.model}
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                  onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'; }}
                />
                {selectedColor && img && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-color opacity-50 transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: selectedColor.hex,
                      maskImage: `url(${img})`,
                      WebkitMaskImage: `url(${img})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                )}
              </div>
            )
            : <div className="w-full h-full flex items-center justify-center text-4xl">🏍️</div>}
          {bike.is_featured ? <span className="absolute top-3 left-3 text-xs px-2 py-1 bg-neon text-ink-900 rounded font-semibold z-10">Featured</span> : null}
        </div>
        <div className="p-4">
          <div className="text-xs text-slate-400 uppercase">{bike.brand}</div>
          <div className="font-semibold text-lg">{bike.model}</div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-2">
            <span className="flex items-center gap-1"><Gauge size={14}/> {bike.engine_cc} cc</span>
            <span className="flex items-center gap-1"><Fuel size={14}/> {bike.mileage} kmpl</span>
            {bike.avg_rating ? <span className="flex items-center gap-1"><Star size={14} className="text-amber-400"/> {Number(bike.avg_rating).toFixed(1)}</span> : null}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-bold text-neon flex items-center"><IndianRupee size={16}/>{Number(bike.price).toLocaleString('en-IN')}</div>
            {colorsList.length > 0 && (
              <div className="flex gap-1.5 items-center" onClick={(e) => e.preventDefault()}>
                {colorsList.slice(0, 4).map((color, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color);
                    }}
                    style={{ backgroundColor: color.hex }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      selectedColor?.name === color.name
                        ? 'border-neon scale-110 shadow-sm shadow-neon/50'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    title={color.name}
                  />
                ))}
                {colorsList.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-semibold self-center ml-0.5">
                    +{colorsList.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
