console.log('DIAG_AUTH_ROUTES - Start');
const express = require('express');
console.log('DIAG_AUTH_ROUTES - express:', typeof express);
const r = express.Router();
console.log('DIAG_AUTH_ROUTES - router before controller require:', typeof r);

const c = require('../controllers/authController');
console.log('DIAG_AUTH_ROUTES - authController:', typeof c, c ? Object.keys(c) : 'null');

const { authRequired } = require('../middleware/auth');
console.log('DIAG_AUTH_ROUTES - authRequired:', typeof authRequired);

r.post('/register', c.register);
r.post('/login', c.login);
r.post('/forgot-password', c.forgotPassword);
r.post('/verify-otp', c.verifyOtp);
r.post('/reset-password', c.resetPassword);
r.post('/change-password', authRequired, c.changePassword);

console.log('DIAG_AUTH_ROUTES - router after routes set:', typeof r);
module.exports = r;
