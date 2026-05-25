require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const bikeRoutes = require('./routes/bikeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

console.log('DIAGNOSTICS - TYPES:', {
  authRoutes: typeof authRoutes,
  bikeRoutes: typeof bikeRoutes,
  userRoutes: typeof userRoutes,
  reviewRoutes: typeof reviewRoutes,
  adminRoutes: typeof adminRoutes,
  errorHandler: typeof errorHandler
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => res.json({ ok: true, name: 'Bike Info API' }));

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// Serve frontend static files
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Catch-all to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const { initDb } = require('./utils/initDb');

if (!process.env.VERCEL) {
  initDb().then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  }).catch(err => {
    console.error("Failed to initialize DB:", err);
  });
} else {
  initDb().catch(err => {
    console.error("Failed to initialize DB on Vercel:", err);
  });
}

module.exports = app;
