const pool = require('../config/db');

exports.recent = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS user_name, u.avatar AS user_avatar, b.brand AS bike_brand, b.model AS bike_model, b.image AS bike_image 
       FROM bike_reviews r
       JOIN users u ON u.id=r.user_id
       JOIN bikes b ON b.id=r.bike_id
       ORDER BY r.created_at DESC LIMIT 6`
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS user_name FROM bike_reviews r
         JOIN users u ON u.id=r.user_id WHERE r.bike_id=? ORDER BY r.created_at DESC`,
      [req.params.bikeId]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    await pool.query('INSERT INTO bike_reviews (bike_id,user_id,rating,comment) VALUES (?,?,?,?)',
      [req.params.bikeId, req.user.id, rating, comment]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

