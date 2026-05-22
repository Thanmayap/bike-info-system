import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Search from './pages/Search.jsx';
import BikeDetails from './pages/BikeDetails.jsx';
import Compare from './pages/Compare.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Private({ children, admin }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="search" element={<Search />} />
        <Route path="bikes/:id" element={<BikeDetails />} />
        <Route path="compare" element={<Compare />} />
        <Route path="dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="profile" element={<Private><Profile /></Private>} />
        <Route path="admin" element={<Private admin><AdminDashboard /></Private>} />
        <Route path="*" element={<div className="p-10 text-center">404 — Not found</div>} />
      </Route>
    </Routes>
  );
}
