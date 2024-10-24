const dotenv = require('dotenv');
dotenv.config();

const config = {
	port: process.env.PORT,
	access_secret: process.env.ACCESS_TOKEN_SECRET,
	refresh_secret: process.env.REFRESH_TOKEN_SECRET,
	admin_secret: process.env.ADMIN_SECRET,
	staff_access_secret: process.env.STAFF_ACCESS_TOKEN_SECRET,
	staff_refresh_secret: process.env.STAFF_REFRESH_TOKEN_SECRET
}

module.exports = config;