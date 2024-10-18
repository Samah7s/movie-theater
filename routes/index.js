const express = require('express');
const router = express.Router();
const authRoute = require('./auth')

router.use("/auth", authRoute);

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

module.exports = router;