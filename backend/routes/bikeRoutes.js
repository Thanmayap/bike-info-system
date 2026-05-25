const r = require('express').Router();
const { authRequired, adminOnly } = require('../middleware/auth');

r.get('/', (req, res, next) => require('../controllers/bikeController').list(req, res, next));
r.post('/compare', (req, res, next) => require('../controllers/bikeController').compare(req, res, next));
r.get('/:id', (req, res, next) => require('../controllers/bikeController').get(req, res, next));
r.post('/', authRequired, adminOnly, (req, res, next) => require('../middleware/upload').single('image')(req, res, next), (req, res, next) => require('../controllers/bikeController').create(req, res, next));
r.put('/:id', authRequired, adminOnly, (req, res, next) => require('../middleware/upload').single('image')(req, res, next), (req, res, next) => require('../controllers/bikeController').update(req, res, next));
r.delete('/:id', authRequired, adminOnly, (req, res, next) => require('../controllers/bikeController').remove(req, res, next));

module.exports = r;
