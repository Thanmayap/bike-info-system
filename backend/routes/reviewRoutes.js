const r = require('express').Router();
const c = require('../controllers/reviewController');
const { authRequired } = require('../middleware/auth');
r.get('/bike/:bikeId', c.list);
r.post('/bike/:bikeId', authRequired, c.create);
module.exports = r;
