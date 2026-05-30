import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';
import BikeCard from '../components/BikeCard.jsx';
import BrandsGrid from '../components/SimilarBrands.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Home() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const [allBikes, setAllBikes] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [q, setQ] = useState('');
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    api.get('/bikes').then(r => setAllBikes(r.data));
    api.get('/reviews/recent').then(r => setRecentReviews(r.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      nav(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  // Define dynamic tab filters based on SQLite seeded data!
  const getBikesForTab = () => {
    switch (activeTab) {
      case 'trending':
        // Seeds & featured (Pulsar N160, iQube, Hunter 350, Duke 390, R15, S1 Pro)
        return allBikes.filter(b => 
          b.is_featured === 1 || 
          ['Pulsar N160', 'iQube', 'Hunter 350'].includes(b.model)
        ).slice(0, 6);
      case 'popular':
        // High-rated commuter & sport bikes
        return allBikes.filter(b => 
          b.engine_cc >= 100 && 
          b.engine_cc <= 400 && 
          b.category_id !== 5 &&
          b.model !== 'Pulsar N160' &&
          b.model !== 'Hunter 350'
        ).slice(0, 6);
      case 'electric':
        // Category 5
        return allBikes.filter(b => b.category_id === 5 || b.category_name?.toLowerCase() === 'electric').slice(0, 6);
      case 'upcoming':
        // Flying Flea pre-releases
        return allBikes.filter(b => b.model.includes('Flying Flea')).slice(0, 6);
      default:
        return allBikes.slice(0, 6);
    }
  };

  const currentTabBikes = getBikesForTab();

  return (
    <div className="space-y-16">
      {/* Premium Hero Search Banner */}
      <section className="relative w-full h-[450px] sm:h-[600px] overflow-hidden rounded-b-3xl sm:rounded-b-[3rem] border-b border-white/10 mb-8">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        >
          {/* Subtle gradient overlay to ensure text visibility and blend with dark theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/20 to-black/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12 sm:pb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 w-full">
            
            {/* Search Input Box */}
            <motion.form 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="w-full md:w-[450px] flex flex-col sm:flex-row gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/20 focus-within:border-white/60 transition-all duration-300"
            >
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search size={18} className="text-slate-300" />
                <input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder={t('searchPrompt')} 
                  className="flex-1 bg-transparent py-3 outline-none text-white text-sm placeholder-slate-300"
                />
              </div>
              <button className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-extrabold rounded-xl text-sm transition-all duration-300 cursor-pointer uppercase tracking-wider">
                {t('searchBtn')}
              </button>
            </motion.form>

            {/* Typography matching User Mockup */}
            <motion.h1 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase text-left md:text-right leading-[0.9]"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              FIND THE<br />RIGHT BIKE
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Featured Bikes tab section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.01] rounded-[24px] p-6 sm:p-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('featuredHeader')}</h2>
            
            {/* View All dynamic Link */}
            <button 
              onClick={() => nav('/search')}
              className="text-xs font-bold text-neon hover:text-neon-glow hover:underline transition self-start sm:self-center"
            >
              {activeTab === 'trending' ? t('viewAllTrending') : activeTab === 'popular' ? t('viewAllPopular') : activeTab === 'electric' ? t('viewAllElectric') : t('viewAllUpcoming')}
            </button>
          </div>

          {/* Interactive tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/5 pb-4 mb-6">
            {[
              { id: 'trending', label: t('tabTrending') },
              { id: 'popular', label: t('tabPopular') },
              { id: 'electric', label: t('tabElectric') },
              { id: 'upcoming', label: t('tabUpcoming') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 dark:bg-neon/15 text-emerald-600 dark:text-neon border border-emerald-200 dark:border-neon/30 shadow shadow-emerald-100 dark:shadow-neon/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid display with slide animations */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {currentTabBikes.map(b => (
                  <BikeCard key={b.id} bike={b} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Slider navigations */}
            <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => {
                  const idx = ['trending', 'popular', 'electric', 'upcoming'].indexOf(activeTab);
                  const nextIdx = (idx - 1 + 4) % 4;
                  setActiveTab(['trending', 'popular', 'electric', 'upcoming'][nextIdx]);
                }}
                className="p-2 rounded-full glass border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => {
                  const idx = ['trending', 'popular', 'electric', 'upcoming'].indexOf(activeTab);
                  const nextIdx = (idx + 1) % 4;
                  setActiveTab(['trending', 'popular', 'electric', 'upcoming'][nextIdx]);
                }}
                className="p-2 rounded-full glass border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* User Reviews Section matching reference screenshot */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.01] rounded-[24px] p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('userReviewsTitle')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{t('userReviewsSubtitle')}</p>
          </div>

          {/* Search reviews bar */}
          <div className="max-w-md flex items-center gap-3 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder={t('userReviewsSearch')}
              className="w-full bg-transparent py-3.5 outline-none text-slate-900 dark:text-white text-sm"
              disabled
            />
          </div>

          <div className="border-t border-slate-200 dark:border-white/5 pt-6">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-300 mb-6">{t('recentlyAddedReviews')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.slice(0, 3).map(rev => {
                const bikeImg = rev.bike_image?.startsWith('http')
                  ? rev.bike_image
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `${window.location.origin}/_/backend` : 'http://localhost:5000')}${rev.bike_image}`;
                  
                return (
                  <motion.div 
                    key={rev.id}
                    whileHover={{ y: -4 }}
                    className="glass border border-slate-200 dark:border-white/5 bg-white/70 dark:bg-white/[0.02] hover:bg-white/90 dark:hover:bg-white/[0.04] p-5 rounded-[20px] space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 shadow-md shadow-slate-200/50 dark:shadow-black/20"
                  >
                    <div className="space-y-3.5">
                      
                      {/* Reviewer Header with Helmet profile avatar */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neon shadow shadow-neon/5">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-neon fill-none stroke-[1.5]">
                            <path d="M12 2 C 6.48 2, 2 6.48, 2 12 C 2 15.6, 3.9 18.7, 6.7 20.5 L 6.7 16 C 6.7 14.5, 7.9 13.3, 9.4 13.3 L 14.6 13.3 C 16.1 13.3, 17.3 14.5, 17.3 16 L 17.3 20.5 C 20.1 18.7, 22 15.6, 22 12 C 22 6.48, 17.52 2, 12 2 Z" />
                            <circle cx="12" cy="9" r="2.5" className="fill-neon/10" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-100 leading-none">{rev.user_name}</div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verified Rider</span>
                        </div>
                      </div>

                      {/* Bike model and star ratings */}
                      <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-black/25 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <img 
                            src={bikeImg} 
                            alt={rev.bike_model} 
                            className="w-12 h-8 object-contain filter drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
                            onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'; }}
                          />
                          <div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t('reviewOn')}</div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{rev.bike_brand} {rev.bike_model}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex justify-end gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                viewBox="0 0 24 24" 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-neon stroke-neon' : 'fill-none stroke-slate-700'} stroke-[1.5]`}
                              >
                                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">
                            {rev.created_at ? (Math.round((Date.now() - new Date(rev.created_at).getTime()) / (1000 * 60 * 60 * 24)) <= 3 ? '3 days' : '1 week') : '3 days'}
                          </span>
                        </div>
                      </div>

                      {/* Quote review comment */}
                      <p className="text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed pt-1">
                        "{rev.comment}"
                      </p>

                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* Brand Grid Section */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <BrandsGrid currentBrand={null} />
      </section>
    </div>
  );
}
