const express = require('express');
const route = express.Router();
const movie = require('../controllers/movie.controller');
const screening = require('../controllers/screening.controllers');
const ensureAdmin = require('../middlewares/ensureAdmin');

route.post('/add', ensureAdmin, movie.create);
route.put('/update', ensureAdmin, movie.update);
route.get('/:id', movie.get);
route.get('/', movie.getAll);
route.delete('/:id', ensureAdmin, movie.delete);

route.post('/screening/add', screening.create);


module.exports = route;