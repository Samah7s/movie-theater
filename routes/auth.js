const express = require('express');
const route = express.Router();
const user = require('../controllers/user.controller');
const staff = require('../controllers/staff.controller');

//USER ROUTES
// Need to work on password, token and so on
route.post('/user/signup', user.signup);

route.get('/user/signin', user.signin);

//STAFF ROUTES
route.post('/staff/signup', staff.signup);

route.get('/staff/signin', staff.signin);

route.get('/token', (req, res) => {
	console.log('creating token');
})

module.exports = route;