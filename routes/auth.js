const express = require('express');
const url = require('url');
const route = express.Router();
const user = require('../controllers/user.controller');
const staff = require('../controllers/staff.controller');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');

//USER ROUTES
route.post('/user/signup', user.signup);
route.get('/user/signin', user.signin);
route.get("/user/signout", user.signout);

//STAFF ROUTES
route.post('/staff/signup', staff.signup);

route.get('/staff/signin', staff.signin);

//TOKEN REFRESH
route.get('/token', async (req, res) => {
	try {
		const currentRefreshToken = req.cookies.refreshToken || req.headers["refresh_token"];
		if (!currentRefreshToken) {
			return res.status(401).json({
				message: "Refresh token not found, please sign in"
			});
		}
		const decodedToken = verifyRefreshToken(currentRefreshToken);
		const foundUser = await prisma.user.findUnique({
			where: {
				email: decodedToken.email
			}
		});
		console.log(foundUser);
		if (!foundUser) {
			return res.status(404).json({
				message: "Bad credentials"
			})
		}
		if (foundUser.refreshToken !== currentRefreshToken) {
			return res.status(401).json({
				message: "Wrong token"
			})
		}
		const access_token = generateAccessToken(foundUser.id, foundUser.email);
		const refresh_token = generateRefreshToken(foundUser.email);
		const updatedResult = await prisma.user.update({
			where: {
				email: foundUser.email
			},
			data: {
				refreshToken: refresh_token
			}
		});
		res.cookie("refreshToken", refresh_token, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			secure: false,
			httpOnly: true
		});
		res.cookie("accessToken", access_token, {
			maxAge: 60 * 60 * 24 * 1000,
			secure: false,
			httpOnly: true
		});
		res.status(200).redirect(url.format({
			pathname: "/api",
		}))
	} catch (error) {
		res.status(498).json({
			message: "Something gone wrong while updating token"
		})
	}
})

module.exports = route;