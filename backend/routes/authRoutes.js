const r = require('express').Router();
const { authRequired } = require('../middleware/auth');

r.post('/register', (req, res, next) => require('../controllers/authController').register(req, res, next));
r.post('/login', (req, res, next) => require('../controllers/authController').login(req, res, next));
r.post('/forgot-password', (req, res, next) => require('../controllers/authController').forgotPassword(req, res, next));
r.post('/verify-otp', (req, res, next) => require('../controllers/authController').verifyOtp(req, res, next));
r.post('/reset-password', (req, res, next) => require('../controllers/authController').resetPassword(req, res, next));
r.post('/change-password', authRequired, (req, res, next) => require('../controllers/authController').changePassword(req, res, next));

module.exports = r;
