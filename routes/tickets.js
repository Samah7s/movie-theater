const express = require('express');
const route = express.Router();
const ticketController = require('../controllers/ticket.controller');

route.post('/', ticketController.createOnline);
route.get('/:id', ticketController.get);
route.get('/', ticketController.getAll);

module.exports = route;


