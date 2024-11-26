const express = require('express');
const route = express.Router();
const ticketController = require('../controllers/ticket.controller');
const seatController = require('../controllers/seat.controller');

//TICKET CRUD 
route.post('/ticket/', ticketController.createOffline);
route.get('/ticket/:id', ticketController.get);
route.get('/ticket/', ticketController.getAll);
route.put('/ticket/:id', ticketController.update);
route.delete('/ticket/:id', ticketController.delete);
//SEATS CRUD
route.post('/seats/addMany', seatController.createMany);
route.post('/seats/addOne', seatController.createOne);
route.get('/seats/', seatController.getAll);
route.put('/seats/:id', seatController.update);
route.delete('/seats/:id', seatController.delete);

module.exports = route;
