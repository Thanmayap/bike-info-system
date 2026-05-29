import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const BRANDS_DATA = [
  // Major ICE Brands
  { name: 'Royal Enfield', logo: 'https://www.google.com/s2/favicons?domain=royalenfield.com&sz=128' },
  { name: 'TVS', logo: 'https://www.google.com/s2/favicons?domain=tvsmotor.com&sz=128' },
  { name: 'Bajaj', logo: 'https://www.google.com/s2/favicons?domain=bajajauto.com&sz=128' },
  { name: 'Honda', logo: 'https://www.google.com/s2/favicons?domain=honda.com&sz=128' },
  { name: 'Yamaha', logo: 'https://www.google.com/s2/favicons?domain=yamaha-motor.com&sz=128' },
  { name: 'Hero', logo: 'https://www.google.com/s2/favicons?domain=heromotocorp.com&sz=128' },
  { name: 'Suzuki', logo: 'https://www.google.com/s2/favicons?domain=globalsuzuki.com&sz=128' },
  
  // Premium & Performance
  { name: 'KTM', logo: 'https://www.google.com/s2/favicons?domain=ktm.com&sz=128' },
  { name: 'Triumph', logo: 'https://www.google.com/s2/favicons?domain=triumphmotorcycles.co.uk&sz=128' },
  { name: 'Kawasaki', logo: 'https://www.google.com/s2/favicons?domain=kawasaki.com&sz=128' },
  { name: 'BMW', logo: 'https://www.google.com/s2/favicons?domain=bmw-motorrad.com&sz=128' },
  { name: 'Ducati', logo: 'https://www.google.com/s2/favicons?domain=ducati.com&sz=128' },
  { name: 'Harley-Davidson', logo: 'https://www.google.com/s2/favicons?domain=harley-davidson.com&sz=128' },
  { name: 'Husqvarna', logo: 'https://www.google.com/s2/favicons?domain=husqvarna-motorcycles.com&sz=128' },
  { name: 'Indian', logo: 'https://www.google.com/s2/favicons?domain=indianmotorcycle.com&sz=128' },
  { name: 'Aprilia', logo: 'https://www.google.com/s2/favicons?domain=aprilia.com&sz=128' },
  { name: 'Benelli', logo: 'https://www.google.com/s2/favicons?domain=benelli.com&sz=128' },
  { name: 'MV Agusta', logo: 'https://www.google.com/s2/favicons?domain=mvagusta.com&sz=128' },
  { name: 'Moto Guzzi', logo: 'https://www.google.com/s2/favicons?domain=motoguzzi.com&sz=128' },

  // Classic & Niche
  { name: 'Jawa', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Jawa_Motors_logo.svg' },
  { name: 'Yezdi', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://yezdi.com&size=128' },
  { name: 'BSA', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bsacompany.co.uk&size=128' },
  { name: 'Brixton', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://brixton-motorcycles.com&size=128' },
  { name: 'Moto Morini', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://motomorini.eu&size=128' },
  { name: 'Keeway', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://keeway.com&size=128' },
  { name: 'QJ Motor', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://qjmotor.com&size=128' },
  { name: 'CFMoto', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://cfmoto.com&size=128' },
  { name: 'Zontes', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://zontes.com&size=128' },

  // Mainstream Scooters
  { name: 'Vespa', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Vespa_logo.svg' },
  { name: 'Piaggio', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Piaggio_logo.svg' },

  // Major Electric Brands
  { name: 'Ola Electric', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://olaelectric.com&size=128' },
  { name: 'Ather', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://atherenergy.com&size=128' },
  { name: 'Vida', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://vidaworld.com&size=128' },
  { name: 'Tork', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://torkmotors.com&size=128' },
  { name: 'Revolt', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://revoltmotors.com&size=128' },
  { name: 'Simple Energy', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://simpleenergy.in&size=128' },
  { name: 'Okinawa', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://okinawaautotech.com&size=128' },
  { name: 'Hero Electric', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://heroelectric.in&size=128' },
  { name: 'Ampere', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://amperevehicles.com&size=128' },
  { name: 'BGauss', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bgauss.com&size=128' },

  // Emerging & Niche Electric
  { name: 'Ultraviolette', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ultraviolette.com&size=128' },
  { name: 'Yo Electric', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://yobykes.in&size=128' },
  { name: 'Quantum Energy', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://quantumenergy.in&size=128' },
  { name: 'VLF Motor', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://vlfindia.com&size=128' },
  { name: 'Bounce', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bounceinfinity.com&size=128' },
  { name: 'Kinetic Green', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kineticgreenvehicles.com&size=128' },
  { name: 'Joy e-bike', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://joyebike.com&size=128' },
  { name: 'PURE EV', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://pureev.in&size=128' },
  { name: 'Oben Electric', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://obenelectric.com&size=128' },
  { name: 'Matter', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://matter.in&size=128' },
  { name: 'Kabira Mobility', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kabiramobility.com&size=128' },
  { name: 'Odysse', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://odysse.in&size=128' },
  { name: 'Okaya', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://okayaev.com&size=128' },
  { name: 'Enigma', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://enigmaautomobiles.com&size=128' },
  { name: 'Komaki', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://komaki.in&size=128' },
  { name: 'iVOOMi', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ivoomienergy.com&size=128' },
  { name: 'BNC Motors', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bncmotors.in&size=128' },
  { name: 'LML', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://lml-emotion.com&size=128' },
  { name: 'Lectrix', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://lectrixev.com&size=128' },
  { name: 'GT Force', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://gtforce.in&size=128' }
];

export default function SimilarBrands() {
  const [showAll, setShowAll] = useState(false);
  const visibleBrands = showAll ? BRANDS_DATA : BRANDS_DATA.slice(0, 10);

  return (
    <section className="bg-[#111] rounded-2xl p-6 mt-10">
      <h2 className="text-white text-xl font-bold mb-6">Popular Brands</h2>

      <div className="border border-[#2a2a2a] rounded-xl overflow-hidden bg-[#161616]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-b border-[#2a2a2a]">
          {visibleBrands.map((brand, i) => (
            <Link
              key={brand.name}
              to={`/search?q=${encodeURIComponent(brand.name)}`}
              className="group border-r border-b border-[#2a2a2a] last:border-r-0 lg:nth-child(5n):border-r-0 p-6 flex flex-col items-center justify-center hover:bg-[#1f1f1f] transition-colors duration-200"
              style={{ textDecoration: 'none', borderBottom: (i >= visibleBrands.length - (visibleBrands.length % 5 || 5)) ? 'none' : '' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.05 }}
                className="w-full flex flex-col items-center"
              >
                {/* White Logo Box */}
                <div className="w-36 h-20 bg-white rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow overflow-hidden mb-4">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="w-[90%] h-[90%] object-contain transform group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=fff&color=000&bold=true&font-size=0.33&length=3`;
                    }}
                  />
                </div>

                {/* Brand Name Text */}
                <div className="text-slate-200 font-bold text-[14px] group-hover:text-white transition-colors">
                  {brand.name}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {/* View More Brands Button inside the frame matching the user screenshot */}
        <div className="flex items-center justify-center p-4 hover:bg-[#1f1f1f] transition-colors cursor-pointer" onClick={() => setShowAll(!showAll)}>
          <span className="text-[#3b82f6] font-medium text-[15px] hover:underline">
            {showAll ? 'View Less Brands' : 'View More Brands'}
          </span>
        </div>
      </div>
    </section>
  );
}
