import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext();
export const useTheme = () => useContext(Ctx);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t==='dark'?'light':'dark') }}>{children}</Ctx.Provider>;
}
