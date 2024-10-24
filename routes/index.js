const express = require('express');
const router = express.Router();
const authRoute = require('./auth')
const movieRoute = require('./movie')
const ensureAuth = require('../middlewares/ensureAuthenticaiton');
const unsureAdmin = require('../middlewares/ensureAdmin');

router.use("/auth", authRoute);
router.use("/movie", movieRoute);

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

router.get('/admin/dashboard', unsureAdmin, (req, res) => {
	try {
		res.status(200).json({
			message: "Admin dashboard"
		})
	} catch (error) {
		res.status(404).json({
			message: "Cannot get access to admin dashboard",
			error: error.message
		})
	}
})
module.exports = router;