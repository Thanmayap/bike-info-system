const r = require('express').Router();
const { authRequired } = require('../middleware/auth');
r.get('/bike/:bikeId', (req, res, next) => require('../controllers/reviewController').list(req, res, next));
r.post('/bike/:bikeId', authRequired, (req, res, next) => require('../controllers/reviewController').create(req, res, next));
module.exports = r;
