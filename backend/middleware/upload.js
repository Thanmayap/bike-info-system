const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    /jpeg|jpg|png|webp/.test(file.mimetype) ? cb(null, true) : cb(new Error('Invalid image')),
});

module.exports = upload;
