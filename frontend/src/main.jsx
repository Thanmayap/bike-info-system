import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <AuthProvider>
            <CompareProvider>
              <BrowserRouter>
                <App />
                <Toaster position="top-right" toastOptions={{ style: { background:'#10151c', color:'#fff' }}}/>
              </BrowserRouter>
            </CompareProvider>
          </AuthProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

