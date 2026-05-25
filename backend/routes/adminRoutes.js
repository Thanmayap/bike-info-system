const r = require('express').Router();
const { authRequired, adminOnly } = require('../middleware/auth');
r.use(authRequired, adminOnly);
r.get('/stats', (req, res, next) => require('../controllers/adminController').stats(req, res, next));
r.get('/users', (req, res, next) => require('../controllers/adminController').users(req, res, next));
r.delete('/users/:id', (req, res, next) => require('../controllers/adminController').deleteUser(req, res, next));
r.get('/categories', (req, res, next) => require('../controllers/adminController').categories(req, res, next));
r.post('/categories', (req, res, next) => require('../controllers/adminController').createCategory(req, res, next));
module.exports = r;
