const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendOtpEmail, sendOtp } = require('../utils/email');

const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role, email: u.email },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, emailOtp, phoneOtp } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    // 1. Verify Email OTP
    if (!emailOtp) {
      return res.status(400).json({ message: 'Email verification is required' });
    }
    const [emailOtpRows] = await pool.query(
      'SELECT * FROM otp_verifications WHERE identifier=? AND otp_code=? AND purpose=?',
      [email, emailOtp, 'register']
    );
    const emailOtpRecord = emailOtpRows[0];
    if (!emailOtpRecord) {
      return res.status(400).json({ message: 'Invalid Email OTP code' });
    }
    if (new Date() > new Date(emailOtpRecord.expires_at)) {
      return res.status(400).json({ message: 'Email OTP code has expired' });
    }

    // 2. Verify Phone OTP if phone is provided
    if (phone) {
      if (!phoneOtp) {
        return res.status(400).json({ message: 'Phone verification is required' });
      }
      const [phoneOtpRows] = await pool.query(
        'SELECT * FROM otp_verifications WHERE identifier=? AND otp_code=? AND purpose=?',
        [phone, phoneOtp, 'register']
      );
      const phoneOtpRecord = phoneOtpRows[0];
      if (!phoneOtpRecord) {
        return res.status(400).json({ message: 'Invalid Phone OTP code' });
      }
      if (new Date() > new Date(phoneOtpRecord.expires_at)) {
        return res.status(400).json({ message: 'Phone OTP code has expired' });
      }
    }

    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });

    if (phone) {
      const [phoneExists] = await pool.query('SELECT id FROM users WHERE phone=?', [phone]);
      if (phoneExists.length) return res.status(409).json({ message: 'Phone number already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)',
      [name, email, hash, phone || null]
    );

    // Clean up OTPs
    await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [email]);
    if (phone) {
      await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [phone]);
    }

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

exports.sendOtp = async (req, res, next) => {
  try {
    const { identifier, purpose } = req.body;
    if (!identifier || !purpose) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const isEmail = identifier.includes('@');
    
    if (purpose === 'login' || purpose === 'reset') {
      const queryStr = isEmail 
        ? 'SELECT id FROM users WHERE email=?' 
        : 'SELECT id FROM users WHERE phone=?';
      const [exists] = await pool.query(queryStr, [identifier]);
      if (!exists.length) {
        return res.status(404).json({ message: 'Account not found with this ' + (isEmail ? 'email' : 'phone number') });
      }
    } else if (purpose === 'register') {
      const queryStr = isEmail 
        ? 'SELECT id FROM users WHERE email=?' 
        : 'SELECT id FROM users WHERE phone=?';
      const [exists] = await pool.query(queryStr, [identifier]);
      if (exists.length) {
        return res.status(409).json({ message: (isEmail ? 'Email' : 'Phone number') + ' already registered' });
      }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [identifier]);
    await pool.query(
      'INSERT INTO otp_verifications (identifier, otp_code, expires_at, purpose) VALUES (?,?,?,?)',
      [identifier, otp, expires, purpose]
    );

    await sendOtp(identifier, otp, purpose);
    res.json({ 
      message: `OTP sent to ${isEmail ? 'email' : 'phone number'}`,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (e) { next(e); }
};

exports.loginWithOtp = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const isEmail = identifier.includes('@');
    
    const [rows] = await pool.query(
      'SELECT * FROM otp_verifications WHERE identifier=? AND otp_code=? AND purpose=?',
      [identifier, otp, 'login']
    );
    const record = rows[0];
    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ message: 'Expired OTP code' });
    }

    const userQuery = isEmail 
      ? 'SELECT * FROM users WHERE email=?' 
      : 'SELECT * FROM users WHERE phone=?';
    const [userRows] = await pool.query(userQuery, [identifier]);
    const user = userRows[0];
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [identifier]);

    delete user.password;
    res.json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, identifier } = req.body;
    const searchVal = identifier || email;
    if (!searchVal) return res.status(400).json({ message: 'Missing email or phone number' });

    const isEmail = searchVal.includes('@');
    const queryStr = isEmail 
      ? 'SELECT id FROM users WHERE email=?' 
      : 'SELECT id FROM users WHERE phone=?';
    
    const [rows] = await pool.query(queryStr, [searchVal]);
    if (!rows.length) {
      return res.status(404).json({ message: (isEmail ? 'Email' : 'Phone number') + ' not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [searchVal]);
    await pool.query(
      'INSERT INTO otp_verifications (identifier, otp_code, expires_at, purpose) VALUES (?,?,?,?)',
      [searchVal, otp, expires, 'reset']
    );

    await sendOtp(searchVal, otp, 'reset');
    res.json({ 
      message: `OTP sent to ${isEmail ? 'email' : 'phone number'}`,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (e) { next(e); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, identifier, otp } = req.body;
    const searchVal = identifier || email;
    if (!searchVal || !otp) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query(
      'SELECT * FROM otp_verifications WHERE identifier=? AND otp_code=? AND purpose=?',
      [searchVal, otp, 'reset']
    );
    const record = rows[0];
    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ message: 'Expired OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, identifier, otp, password } = req.body;
    const searchVal = identifier || email;
    if (!searchVal || !otp || !password) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query(
      'SELECT * FROM otp_verifications WHERE identifier=? AND otp_code=? AND purpose=?',
      [searchVal, otp, 'reset']
    );
    const record = rows[0];
    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ message: 'Expired OTP' });
    }

    const hash = await bcrypt.hash(password, 10);
    const isEmail = searchVal.includes('@');
    const updateStr = isEmail 
      ? 'UPDATE users SET password=? WHERE email=?' 
      : 'UPDATE users SET password=? WHERE phone=?';

    await pool.query(updateStr, [hash, searchVal]);
    await pool.query('DELETE FROM otp_verifications WHERE identifier=?', [searchVal]);

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
