import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const hideChrome = ['/login','/register','/forgot-password'].includes(pathname);
  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1"><Outlet /></main>
      {!hideChrome && <Footer />}
    </div>
  );
}
