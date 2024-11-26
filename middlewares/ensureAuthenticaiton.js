const url = require('url');
const { verifyAccessToken } = require('../utils/token');
const prisma = require('../utils/prisma');

async function ensureAuthentication(req, res, next) {
	try {
		const token = req.cookies.accessToken || req.headers["access-token"]?.replace("Bearer ", "");
		if (!token) {
			console.log("token not provided");
			throw new Error("Token not provided, please login");
		}
		const decodedToken = verifyAccessToken(token);
		const user = await prisma.user.findUnique({
			where: {
				email: decodedToken.id
			},
			select: {
				id: true,
				email: true
			}
		})
		req.user = user;
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