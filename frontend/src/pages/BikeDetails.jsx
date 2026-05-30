import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ChevronDown, Award, ShieldAlert, Radio } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Loader from '../components/Loader.jsx';
import SimilarBrands from '../components/SimilarBrands.jsx';
import Showroom360 from '../components/Showroom360.jsx';

export default function BikeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bike, setBike] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');

  // Accordion state
  const [expandedRows, setExpandedRows] = useState({
    mileage: false,
    weight: false,
    height: false
  });

  // Cross-selling model stats
  const [brandCount, setBrandCount] = useState(0);
  const [brandMinPrice, setBrandMinPrice] = useState(0);

  const toggleRow = (row) => {
    setExpandedRows(prev => ({ ...prev, [row]: !prev[row] }));
  };

  useEffect(() => {
    api.get(`/bikes/${id}`).then(r => {
      setBike(r.data);
      if (r.data.colors) {
        try {
          const parsed = JSON.parse(r.data.colors);
          if (parsed && parsed.length > 0) {
            setSelectedColor(parsed[0]);
          }
        } catch(e) {}
      }

      // Fetch other brand models for stats
      api.get(`/bikes?brand=${encodeURIComponent(r.data.brand)}`).then(res => {
        const otherModels = res.data.filter(b => b.id !== r.data.id);
        setBrandCount(otherModels.length);
        if (otherModels.length > 0) {
          const prices = otherModels.map(b => Number(b.price));
          setBrandMinPrice(Math.min(...prices));
        } else {
          setBrandMinPrice(Number(r.data.price));
        }
      });

    });
    api.get(`/reviews/bike/${id}`).then(r => setReviews(r.data));
    if (user) api.post(`/users/recent/${id}`).catch(()=>{});
  }, [id, user]);

  const save = async () => {
    if (!user) return toast.error('Login first');
    const { data } = await api.post(`/users/wishlist/${id}`);
    toast.success(data.saved ? 'Saved' : 'Removed from saved');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login first');
    await api.post(`/reviews/bike/${id}`, review);
    const { data } = await api.get(`/reviews/bike/${id}`);
    setReviews(data); setReview({ rating:5, comment:'' });
    toast.success('Review posted');
  };

  if (!bike) return <Loader/>;
  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `${window.location.origin}/_/backend` : 'http://localhost:5000');
    return `${baseUrl}${image}`;
  };
  const img = getImageSrc(bike.image);

  let colorsList = [];
  if (bike.colors) {
    try {
      colorsList = JSON.parse(bike.colors);
    } catch(e) {}
  }

  // Parse Special Features columns
  const featuresText = (bike.features || '').toLowerCase();
  const hasABS = featuresText.includes('abs') || featuresText.includes('braking') || bike.model.includes('N160');
  const hasLED = featuresText.includes('led') || featuresText.includes('light') || featuresText.includes('projector') || bike.model.includes('N160');
  const hasBluetooth = featuresText.includes('bluetooth') || featuresText.includes('nav') || featuresText.includes('app') || featuresText.includes('console') || bike.brand === 'Ola';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="glass overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-1 p-2 bg-ink-950/40 border-b border-white/5">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-neon/15 text-neon font-bold shadow-sm shadow-neon/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📸 Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab('showroom')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'showroom'
                  ? 'bg-neon/15 text-neon font-bold shadow-sm shadow-neon/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 Interactive 3D & 360° View
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[380px]">
            {activeTab === 'showroom' ? (
              <div className="w-full h-full min-h-[380px] self-stretch">
                <Showroom360 bike={bike} selectedColor={selectedColor} />
              </div>
            ) : (
              img ? (
                <div className="w-full h-full relative flex items-center justify-center p-4">
                  <img
                    src={img}
                    alt={bike.model}
                    className="w-full max-h-[450px] object-contain transition-all duration-300"
                    onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'; }}
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-ink-700 flex items-center justify-center text-slate-500 text-6xl w-full">🏍️</div>
              )
            )}
          </div>

          {colorsList.length > 0 && activeTab === 'gallery' && (
            <div className="p-4 border-t border-white/5 bg-ink-950/20 flex flex-col gap-2">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Available Colors</div>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                      selectedColor?.name === color.name
                        ? 'border-neon scale-110 shadow-lg shadow-neon/40'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="text-xs text-slate-400 uppercase">{bike.brand} • {bike.category_name}</div>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1 text-white">{bike.model}</h1>
            <div className="text-3xl text-neon font-black mt-3">₹{Number(bike.price).toLocaleString('en-IN')}</div>
            {selectedColor && (
              <div className="mt-3 text-sm text-slate-300">
                Active Color: <span className="font-semibold text-neon uppercase tracking-wide">{selectedColor.name}</span>
              </div>
            )}
            <p className="text-slate-400 mt-4 leading-relaxed">{bike.description}</p>
            
            {/* Tech Feature badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {hasLED && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl shadow shadow-cyan-500/5">
                  <Award size={13} /> {t('techLedHeadlight')}
                </span>
              )}
              {hasABS && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl shadow shadow-rose-500/5">
                  <ShieldAlert size={13} /> {t('techAbs')}
                </span>
              )}
              {hasBluetooth && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-neon bg-neon/10 border border-neon/20 rounded-xl shadow shadow-neon/5">
                  <Radio size={13} className="animate-pulse" /> {t('techBluetooth')}
                </span>
              )}
            </div>

            <button onClick={save} className="btn btn-primary mt-6 flex items-center gap-2 cursor-pointer"><Heart size={16}/> Save to Wishlist</button>
          </div>

          {/* Explore other brand models */}
          <div className="glass p-5 border border-white/5 bg-white/[0.02] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neon/15 flex items-center justify-center text-neon border border-neon/20">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-neon fill-none stroke-[1.5]">
                  <path d="M9 17 L2 17 L2 7 L9 7 Z" />
                  <path d="M15 17 L22 17 L22 7 L15 7 Z" />
                  <path d="M9 12 L15 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">{t('exploreOther')} {bike.brand} Models</h4>
                <p className="text-xs text-slate-400 pt-0.5">{bike.brand} offers {brandCount} more models starting from ₹{brandMinPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <button 
              onClick={() => nav(`/search?q=${encodeURIComponent(bike.brand)}`)}
              className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-neon hover:bg-neon/5 text-xs font-extrabold text-slate-200 hover:text-neon rounded-xl transition cursor-pointer"
            >
              {t('viewAll')}
            </button>
          </div>

          {/* Interactive specification highlights accordion matching your screenshot */}
          <div className="glass border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/[0.02] border-b border-white/5 font-extrabold text-xs uppercase tracking-widest text-slate-300">
              {bike.model} {t('keyHighlights')}
            </div>
            
            <div className="divide-y divide-white/5 text-sm text-slate-300">
              
              {/* Row 1: Engine capacity / Motor Power */}
              <div className="p-4 flex justify-between items-center bg-black/10">
                <span className="text-slate-400 font-medium">
                  {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric')))
                    ? 'Motor Power'
                    : t('engineCapacity')}
                </span>
                <span className="font-extrabold text-white text-right">
                  {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric')))
                    ? (
                      (bike.features && bike.features.match(/Motor:\s*([^|]+)/i)) ? bike.features.match(/Motor:\s*([^|]+)/i)[1].trim() :
                      (bike.power && !bike.power.toLowerCase().includes('kwh')) ? bike.power : 'EV Motor'
                    )
                    : (bike.engine_cc ? `${bike.engine_cc} cc` : 'N/A')}
                </span>
              </div>

              {/* Row 2: Mileage expandable */}
              <div className="divide-y divide-white/[0.02]">
                <button 
                  onClick={() => toggleRow('mileage')}
                  className="w-full p-4 flex justify-between items-center hover:bg-white/[0.02] transition cursor-pointer text-left"
                >
                  <span className="text-slate-400 font-medium">
                    {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric'))) 
                      ? 'Riding Range ℹ️' 
                      : t('mileageArai') + ' ℹ️'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">
                      {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric')))
                        ? (
                          (bike.features && bike.features.match(/Range:\s*([^|]+)/i)) ? bike.features.match(/Range:\s*([^|]+)/i)[1].trim() :
                          (bike.mileage ? `${bike.mileage} km/charge` : 'N/A')
                        )
                        : (bike.mileage ? `${bike.mileage} kmpl` : 'N/A')}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${expandedRows.mileage ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedRows.mileage && (
                  <div className="p-4 bg-black/35 text-xs text-neon leading-relaxed font-bold animate-fadeIn">
                    Better mileage than <span className="underline">62%</span> of commuter and street bikes.
                  </div>
                )}
              </div>

              {/* Row 3: Transmission */}
              <div className="p-4 flex justify-between items-center bg-black/10">
                <span className="text-slate-400 font-medium">{t('transmission')}</span>
                <span className="font-extrabold text-white text-right">{bike.transmission || '5 Speed Manual'}</span>
              </div>

              {/* Row 4: Kerb Weight */}
              <div className="divide-y divide-white/[0.02]">
                <button 
                  onClick={() => toggleRow('weight')}
                  className="w-full p-4 flex justify-between items-center hover:bg-white/[0.02] transition cursor-pointer text-left"
                >
                  <span className="text-slate-400 font-medium">{t('kerbWeight')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{bike.weight ? `${bike.weight} kg` : 'N/A'}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${expandedRows.weight ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedRows.weight && (
                  <div className="p-4 bg-black/35 text-xs text-neon leading-relaxed font-bold animate-fadeIn">
                    Lower kerb weight than <span className="underline">64%</span> of street bikes.
                  </div>
                )}
              </div>

              {/* Row 5: Fuel/Battery capacity */}
              <div className="p-4 flex justify-between items-center bg-black/10">
                <span className="text-slate-400 font-medium">
                  {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric'))) 
                    ? 'Battery Capacity' 
                    : t('fuelTankCapacity')}
                </span>
                <span className="font-extrabold text-white text-right">
                  {(bike.engine_cc === 0 || bike.fuel_capacity === null || (bike.category_name && bike.category_name.toLowerCase().includes('electric'))) 
                    ? (
                      // Try to extract battery capacity from features or power
                      (bike.features && bike.features.match(/Battery:\s*([^|]+)/i)) ? bike.features.match(/Battery:\s*([^|]+)/i)[1].trim() :
                      (bike.power && bike.power.toLowerCase().includes('kwh')) ? bike.power :
                      'N/A'
                    ) 
                    : (bike.fuel_capacity ? `${bike.fuel_capacity} litres` : 'N/A')}
                </span>
              </div>

              {/* Row 6: Seat height */}
              <div className="divide-y divide-white/[0.02]">
                <button 
                  onClick={() => toggleRow('height')}
                  className="w-full p-4 flex justify-between items-center hover:bg-white/[0.02] transition cursor-pointer text-left"
                >
                  <span className="text-slate-400 font-medium">{t('seatHeight')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">
                      {(bike.features && bike.features.match(/Seat Height:\s*([0-9.]+)\s*mm/i)) 
                        ? `${bike.features.match(/Seat Height:\s*([0-9.]+)\s*mm/i)[1]} mm` 
                        : 'N/A'}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${expandedRows.height ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedRows.height && (
                  <div className="p-4 bg-black/35 text-xs text-neon leading-relaxed font-bold animate-fadeIn">
                    Lower seat height than <span className="underline">65%</span> of street bikes.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="glass p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={()=>setReview({...review,rating:n})}>
                  <Star size={18} className={n<=review.rating?'text-amber-400 fill-amber-400':'text-slate-600'}/>
                </button>
              ))}
            </div>
            <textarea required placeholder="Share your experience..." value={review.comment}
                      onChange={e=>setReview({...review,comment:e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg" rows="3"/>
            <button className="btn btn-primary mt-2">Post review</button>
          </form>
        )}
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="glass p-4">
              <div className="flex justify-between items-center">
                <div className="font-semibold">{r.user_name}</div>
                <div className="flex">{[...Array(r.rating)].map((_,i)=><Star key={i} size={14} className="text-amber-400 fill-amber-400"/>)}</div>
              </div>
              <p className="text-slate-400 text-sm mt-2">{r.comment}</p>
            </div>
          ))}
          {!reviews.length && <p className="text-slate-500 text-sm">No reviews yet.</p>}
        </div>
      </section>

      <SimilarBrands currentBrand={bike.brand} />
    </div>
  );
}

