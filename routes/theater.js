const express = require('express');
const route = express.Router();
const seat = require('../controllers/seat.controller');
const ensureAdmin = require('../middlewares/ensureAdmin');

route.post('/seats/add', seat.createMany);
route.post('/seats/addOne', seat.createOne);
route.get('/seats/', seat.getAll);

module.exports = route;