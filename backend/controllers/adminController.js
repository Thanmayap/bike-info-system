const pool = require('../config/db');

exports.stats = async (_req, res, next) => {
  try {
    const [[u]] = await pool.query('SELECT COUNT(*) c FROM users');
    const [[b]] = await pool.query('SELECT COUNT(*) c FROM bikes');
    const [[r]] = await pool.query('SELECT COUNT(*) c FROM bike_reviews');
    const [[c]] = await pool.query('SELECT COUNT(*) c FROM comparisons');
    const [recent] = await pool.query('SELECT id,brand,model,image,created_at FROM bikes ORDER BY created_at DESC LIMIT 5');
    const [byBrand] = await pool.query('SELECT brand, COUNT(*) total FROM bikes GROUP BY brand');
    const [usersByMonth] = await pool.query(
      `SELECT DATE_FORMAT(created_at,'%Y-%m') month, COUNT(*) total
         FROM users GROUP BY month ORDER BY month`);
    res.json({ users:u.c, bikes:b.c, reviews:r.c, comparisons:c.c, recent, byBrand, usersByMonth });
  } catch (e) { next(e); }
};

exports.users = async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM users WHERE id=? AND role!="admin"', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.categories = async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bike_categories ORDER BY name');
    res.json(rows);
  } catch (e) { next(e); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const [r] = await pool.query('INSERT INTO bike_categories (name,description) VALUES (?,?)',
      [name, description]);
    res.json({ id: r.insertId });
  } catch (e) { next(e); }
};
