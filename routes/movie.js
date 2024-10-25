const express = require('express');
const route = express.Router();
const movie = require('../controllers/movie.controller');
const screening = require('../controllers/screening.controllers');
const ensureAdmin = require('../middlewares/ensureAdmin');

//MOVIE CRUD ROUTES
route.post('/add', ensureAdmin, movie.create);
route.put('/update', ensureAdmin, movie.update);
route.get('/:id', movie.get);
route.get('/', movie.getAll);
route.delete('/:id', ensureAdmin, movie.delete);

//SCREENING CRUD ROUTES
route.post('/screening/add', ensureAdmin, screening.create);
route.get('/screening/:id', screening.get);
route.get('/screening/', screening.getAll);
route.put('/screening/:id', ensureAdmin, screening.update);
route.delete('/screening/:id', ensureAdmin, screening.delete);



module.exports = route;