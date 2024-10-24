const url = require('url');
const prisma = require('../utils/prisma');
const { verifyStaffAccessToken } = require('../utils/token');

async function ensureAdmin(req, res, next) {
	try {
		const token = req.cookies.accessToken || req.headers["access-token"]?.replace("Bearer ", "");
		const decodedToken = verifyStaffAccessToken(token);
		const role = await prisma.role.findUnique({
			where: {
				id: decodedToken.roleId
			}
		});
		if (role.name == "ADMIN") {
			req.adminEnter = true;
			next();
		}
	} catch (error) {
		res.status(498).redirect(
			url.format({
				pathname: "/api",
			})
		);
	}
}

module.exports = ensureAdmin;