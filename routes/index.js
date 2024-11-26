const express = require('express');
const router = express.Router();
const authRoute = require('./auth')
const movieRoute = require('./movie')
const theaterRoute = require('./theater');
const adminRoutes = require('./admin');
const ticketRoute = require('./tickets');
const ensureAuth = require('../middlewares/ensureAuthenticaiton');
const ensureAdmin = require('../middlewares/ensureAdmin');

router.get("/", (req, res) => {
	try {
		res.status(200).json({
			message: "Welcome to the main page"
		})
	} catch (error) {
		res.status(404).json({
			message: "Cannot reach to the main page"
		})
	}
})

router.get('/protected', ensureAuth, (req, res) => {
	res.status(200).json({
		message: "Protected source",
		data: req.decodedToken
	})
})

router.use("/admin", ensureAdmin, adminRoutes);
router.use("/auth", authRoute);
router.use("/movie", movieRoute);
router.use("/ticket", ensureAuth,ticketRoute);
router.use("/theater", theaterRoute);

module.exports = router;