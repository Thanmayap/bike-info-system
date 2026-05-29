import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [selectedBikes, setSelectedBikes] = useState(() => {
    const saved = localStorage.getItem('compareBikes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareBikes', JSON.stringify(selectedBikes));
  }, [selectedBikes]);

  const toggleCompare = (id) => {
    setSelectedBikes(prev => {
      if (prev.includes(id)) {
        return prev.filter(bId => bId !== id);
      }
      if (prev.length >= 4) {
        toast.error('You can only compare up to 4 bikes');
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeCompare = (id) => {
    setSelectedBikes(prev => prev.filter(bId => bId !== id));
  };

  const clearCompare = () => setSelectedBikes([]);

  return (
    <CompareContext.Provider value={{ selectedBikes, toggleCompare, removeCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
