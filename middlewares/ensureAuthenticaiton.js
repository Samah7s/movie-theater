const url = require('url');
const { verifyAccessToken } = require('../utils/token');

async function ensureAuthentication(req, res, next) {
	try {
		const token = req.cookies.accessToken || req.headers["access-token"]?.replace("Bearer ", "");
		if (!token) {
			console.log("token not provided");
			throw new Error("Token not provided, please login");
		}
		const decodedToken = verifyAccessToken(token);
		req.decodedToken = decodedToken;
		next();
	} catch (error) {
		res.status(498).redirect(
			url.format({
				pathname: "auth/token",
			})
		);
	}
}

module.exports = ensureAuthentication;