import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import SimilarBrands from '../components/SimilarBrands.jsx';

export default function BikeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [bike, setBike] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const [selectedColor, setSelectedColor] = useState(null);

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
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${image}`;
  };
  const img = getImageSrc(bike.image);

  let colorsList = [];
  if (bike.colors) {
    try {
      colorsList = JSON.parse(bike.colors);
    } catch(e) {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="glass overflow-hidden flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center p-4 relative min-h-[350px]">
            {img
              ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img
                    src={img}
                    alt={bike.model}
                    className="w-full max-h-[450px] object-contain transition-all duration-300"
                    onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'; }}
                  />
                  {selectedColor && (
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-color opacity-50 transition-all duration-300"
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
              : <div className="aspect-[4/3] bg-ink-700 flex items-center justify-center text-slate-500 text-6xl w-full">🏍️</div>}
          </div>
          {colorsList.length > 0 && (
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
        <div>
          <div className="text-xs text-slate-400 uppercase">{bike.brand} • {bike.category_name}</div>
          <h1 className="text-4xl font-bold mt-1">{bike.model}</h1>
          <div className="text-3xl text-neon font-bold mt-3">₹{Number(bike.price).toLocaleString('en-IN')}</div>
          {selectedColor && (
            <div className="mt-3 text-sm text-slate-300">
              Active Color: <span className="font-semibold text-neon uppercase tracking-wide">{selectedColor.name}</span>
            </div>
          )}
          <p className="text-slate-400 mt-4 leading-relaxed">{bike.description}</p>
          <button onClick={save} className="btn btn-primary mt-6 flex items-center gap-2"><Heart size={16}/> Save to Wishlist</button>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              ['Engine', `${bike.engine_cc} cc`],
              ['Mileage', `${bike.mileage} kmpl`],
              ['Power', bike.power],
              ['Torque', bike.torque],
              ['Top speed', `${bike.top_speed} km/h`],
              ['Transmission', bike.transmission],
              ['Fuel capacity', `${bike.fuel_capacity} L`],
              ['Features', bike.features],
            ].map(([k,v]) => (
              <div key={k} className="glass p-4">
                <div className="text-xs text-slate-400">{k}</div>
                <div className="font-semibold mt-1">{v || '—'}</div>
              </div>
            ))}
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
