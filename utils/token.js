const jwt = require('jsonwebtoken');
const config = require('../config/index');

function generateAccessToken(id, email) {
	return jwt.sign({ id, email }, config.access_secret, {
		expiresIn: 1000 * 60,
	});
}
function generateStaffAccessToken(roleId, email) {
	return jwt.sign({ roleId, email }, config.staff_access_secret, {
		expiresIn: 1000 * 60 * 1,
	});
}

function generateRefreshToken(email) {
	return jwt.sign({ email }, config.refresh_secret, {
		expiresIn: "14d",
	});
}
function generateStaffRefreshToken(email) {
	return jwt.sign({ email }, config.staff_refresh_secret, {
		expiresIn: "14d",
	});
}

function verifyAccessToken(token) {
	return jwt.verify(token, config.access_secret);
}

function verifyRefreshToken(token) {
	return jwt.verify(token, config.refresh_secret);
}

function verifyStaffAccessToken(token) {
	return jwt.verify(token, config.staff_access_secret);
}

function verifyStaffRefreshToken(token) {
	return jwt.verify(token, config.staff_refresh_secret);
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	generateStaffAccessToken,
	generateStaffRefreshToken,
	verifyStaffAccessToken,
	verifyStaffRefreshToken
}