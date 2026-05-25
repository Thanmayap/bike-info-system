const pool = require('../config/db');
console.log('DIAGNOSTICS - pool in bikeController:', typeof pool, pool ? Object.keys(pool) : 'null');
if (pool && pool.default) {
  console.log('DIAGNOSTICS - pool.default in bikeController:', typeof pool.default, Object.keys(pool.default));
}

exports.list = async (req, res, next) => {
  try {
    const { search, brand, minPrice, maxPrice, minMileage, category, featured } = req.query;
    let sql = `SELECT b.*, c.name AS category_name,
                 (SELECT AVG(rating) FROM bike_reviews WHERE bike_id=b.id) AS avg_rating
               FROM bikes b LEFT JOIN bike_categories c ON c.id=b.category_id WHERE 1=1`;
    const args = [];
    if (search)     { sql += ' AND (b.brand LIKE ? OR b.model LIKE ?)'; args.push(`%${search}%`,`%${search}%`); }
    if (brand)      { sql += ' AND b.brand=?'; args.push(brand); }
    if (minPrice)   { sql += ' AND b.price>=?'; args.push(minPrice); }
    if (maxPrice)   { sql += ' AND b.price<=?'; args.push(maxPrice); }
    if (minMileage) { sql += ' AND b.mileage>=?'; args.push(minMileage); }
    if (category)   { sql += ' AND b.category_id=?'; args.push(category); }
    if (featured)   { sql += ' AND b.is_featured=1'; }
    sql += ' ORDER BY b.created_at DESC';
    const [rows] = await pool.query(sql, args);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, c.name AS category_name FROM bikes b
         LEFT JOIN bike_categories c ON c.id=b.category_id WHERE b.id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const b = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const [r] = await pool.query(
      `INSERT INTO bikes
       (brand,model,category_id,price,mileage,engine_cc,power,torque,top_speed,fuel_capacity,transmission,features,description,image,is_featured)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [b.brand,b.model,b.category_id||null,b.price,b.mileage||null,b.engine_cc||null,b.power,b.torque,
       b.top_speed||null,b.fuel_capacity||null,b.transmission,b.features,b.description,image,b.is_featured?1:0]);
    res.json({ id: r.insertId });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const b = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : b.image;
    await pool.query(
      `UPDATE bikes SET brand=?,model=?,category_id=?,price=?,mileage=?,engine_cc=?,power=?,torque=?,
                        top_speed=?,fuel_capacity=?,transmission=?,features=?,description=?,image=?,is_featured=?
       WHERE id=?`,
      [b.brand,b.model,b.category_id||null,b.price,b.mileage||null,b.engine_cc||null,b.power,b.torque,
       b.top_speed||null,b.fuel_capacity||null,b.transmission,b.features,b.description,image,b.is_featured?1:0,
       req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM bikes WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.compare = async (req, res, next) => {
  try {
    const ids = (req.body.ids || []).map(Number).filter(Boolean);
    if (!ids.length) return res.json([]);
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT b.*, c.name AS category_name FROM bikes b
         LEFT JOIN bike_categories c ON c.id=b.category_id
         WHERE b.id IN (${placeholders})`, ids);
    if (req.user) {
      await pool.query('INSERT INTO comparisons (user_id, bike_ids) VALUES (?,?)',
        [req.user.id, ids.join(',')]);
    }
    res.json(rows);
  } catch (e) { next(e); }
};
