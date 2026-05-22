import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import api from '../api/client';

// Brand logos using colored initials — replace with actual logo images if available
const BRAND_COLORS = {
  'Yamaha':        { bg: '#0a0a0a', color: '#3b82f6', label: 'YM' },
  'Honda':         { bg: '#cc0000', color: '#fff',    label: 'HN' },
  'Royal Enfield': { bg: '#1a1a2e', color: '#c9a84c', label: 'RE' },
  'KTM':           { bg: '#ff6b00', color: '#fff',    label: 'KTM'},
  'Bajaj':         { bg: '#003087', color: '#fff',    label: 'BJ' },
  'Ola':           { bg: '#16213e', color: '#00d4aa', label: 'OLA'},
  'Hero':          { bg: '#b50000', color: '#fff',    label: 'HR' },
  'TVS':           { bg: '#0e2a47', color: '#f5a623', label: 'TVS'},
  'Suzuki':        { bg: '#1c3c6e', color: '#e84c4c', label: 'SZ' },
  'Kawasaki':      { bg: '#006f36', color: '#fff',    label: 'KW' },
};

export default function SimilarBrands({ currentBrand }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get('/bikes').then(r => {
      const counts = {};
      r.data.forEach(b => {
        if (!currentBrand || b.brand !== currentBrand) {
          counts[b.brand] = (counts[b.brand] || 0) + 1;
        }
      });
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));
      setBrands(sorted);
    });
  }, [currentBrand]);

  if (!brands.length) return null;

  return (
    <section style={{
      background: '#1a1a1a',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '40px'
    }}>
      <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
        {currentBrand ? `Brands Similar to ${currentBrand}` : 'Browse by Brand'}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        {brands.map((brand, i) => {
          const style = BRAND_COLORS[brand.name] || { bg: '#2a2a2a', color: '#fff', label: brand.name.slice(0,2).toUpperCase() };
          return (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                to={`/search?q=${encodeURIComponent(brand.name)}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#252525',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Brand Logo Box */}
                  <div style={{
                    width: '64px',
                    height: '48px',
                    background: style.bg,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{
                      color: style.color,
                      fontWeight: '900',
                      fontSize: style.label.length > 2 ? '11px' : '14px',
                      letterSpacing: '1px'
                    }}>{style.label}</span>
                  </div>

                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                    {brand.name}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                    {brand.count} Bike{brand.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link
          to="/search"
          style={{
            color: '#3b9eff',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View More Brands <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
