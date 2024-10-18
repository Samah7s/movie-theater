const dotenv = require('dotenv');
dotenv.config();

const config = {
	port: process.env.PORT,
	access_secret: process.env.ACCESS_TOKEN_SECRET,
	refresh_secret: process.env.REFRESH_TOKEN_SECRET
}

module.exports = config;