const pool = require('../config/db');

exports.me = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,name,email,phone,avatar,role,created_at FROM users WHERE id=?',
      [req.user.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    await pool.query('UPDATE users SET name=?, phone=?, avatar=? WHERE id=?',
      [name, phone, avatar, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.wishlist = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.* FROM wishlist w JOIN bikes b ON b.id=w.bike_id
        WHERE w.user_id=? ORDER BY w.created_at DESC`, [req.user.id]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const bikeId = req.params.id;
    const [exists] = await pool.query('SELECT id FROM wishlist WHERE user_id=? AND bike_id=?',
      [req.user.id, bikeId]);
    if (exists.length) {
      await pool.query('DELETE FROM wishlist WHERE id=?', [exists[0].id]);
      return res.json({ saved: false });
    }
    await pool.query('INSERT INTO wishlist (user_id,bike_id) VALUES (?,?)', [req.user.id, bikeId]);
    res.json({ saved: true });
  } catch (e) { next(e); }
};

exports.recent = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, MAX(r.viewed_at) AS viewed_at
         FROM recently_viewed r JOIN bikes b ON b.id=r.bike_id
        WHERE r.user_id=? GROUP BY b.id ORDER BY viewed_at DESC LIMIT 12`,
      [req.user.id]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.trackRecent = async (req, res, next) => {
  try {
    await pool.query('INSERT INTO recently_viewed (user_id,bike_id) VALUES (?,?)',
      [req.user.id, req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.dashboardStats = async (req, res, next) => {
  try {
    const [[w]] = await pool.query('SELECT COUNT(*) c FROM wishlist WHERE user_id=?', [req.user.id]);
    const [[c]] = await pool.query('SELECT COUNT(*) c FROM comparisons WHERE user_id=?', [req.user.id]);
    const [[r]] = await pool.query('SELECT COUNT(DISTINCT bike_id) c FROM recently_viewed WHERE user_id=?', [req.user.id]);
    res.json({ saved: w.c, compared: c.c, recent: r.c });
  } catch (e) { next(e); }
};
