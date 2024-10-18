const jwt = require('jsonwebtoken');
const config = require('../config/index');

function generateAccessToken(id, email) {
	return jwt.sign({ id, email }, config.access_secret, {
		expiresIn: 1000 * 60 * 60,
	});
}

function generateRefreshToken(email) {
	return jwt.sign({ email }, config.refresh_secret, {
		expiresIn: "14d",
	});
}

function verifyToken(token) {
	return jwt.verify(token, config.access_secret);
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyToken
}