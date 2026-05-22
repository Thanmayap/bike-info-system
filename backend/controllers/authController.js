const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendOtpEmail } = require('../utils/email');

const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role, email: u.email },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)',
      [name, email, hash, phone || null]
    );
    const user = { id: r.insertId, name, email, role: 'user' };
    res.json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    delete user.password;
    res.json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'Email not found' });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query('UPDATE users SET reset_otp=?, reset_otp_expires=? WHERE email=?',
      [otp, expires, email]);
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (e) { next(e); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email=? AND reset_otp=? AND reset_otp_expires>NOW()',
      [email, otp]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified' });
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email=? AND reset_otp=? AND reset_otp_expires>NOW()',
      [email, otp]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password=?, reset_otp=NULL, reset_otp_expires=NULL WHERE email=?',
      [hash, email]);
    res.json({ message: 'Password reset successful' });
  } catch (e) { next(e); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current, next: nextPwd } = req.body;
    const [rows] = await pool.query('SELECT password FROM users WHERE id=?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(current, rows[0].password);
    if (!ok) return res.status(400).json({ message: 'Wrong current password' });
    const hash = await bcrypt.hash(nextPwd, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (e) { next(e); }
};
