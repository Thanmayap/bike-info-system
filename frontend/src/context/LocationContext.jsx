import { createContext, useContext, useEffect, useState } from 'react';

const LocationCtx = createContext(null);
export const useLocation = () => useContext(LocationCtx);

export function LocationProvider({ children }) {
  const [activeCity, setActiveCity] = useState(() => {
    return localStorage.getItem('activeCity') || 'Mumbai';
  });

  const [activePincode, setActivePincode] = useState(() => {
    return localStorage.getItem('activePincode') || '';
  });

  useEffect(() => {
    localStorage.setItem('activeCity', activeCity);
  }, [activeCity]);

  useEffect(() => {
    localStorage.setItem('activePincode', activePincode);
  }, [activePincode]);

  const detectLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real-world system, we would query a reverse-geocoding API with latitude & longitude.
          // For this premium local experience, we will simulate a GPS match to Bangalore or Delhi!
          const simulatedCities = ['Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Kolkata'];
          const randomCity = simulatedCities[Math.floor(Math.random() * simulatedCities.length)];
          setActiveCity(randomCity);
          setActivePincode('560001'); // Standard mock pincode
          resolve({ city: randomCity, pincode: '560001' });
        },
        (error) => {
          reject(error);
        },
        { timeout: 5000 }
      );
    });
  };

  const selectCity = (city, pincode = '') => {
    setActiveCity(city);
    setActivePincode(pincode);
  };

  return (
    <LocationCtx.Provider value={{ activeCity, activePincode, detectLocation, selectCity }}>
      {children}
    </LocationCtx.Provider>
  );
}
