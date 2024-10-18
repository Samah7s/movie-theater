const Joi = require('joi');
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');


const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
	repeat_password: Joi.ref('password')
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
})

class User {
	constructor() {
		this.signup = this.signup.bind(this);
		this.signin = this.signin.bind(this);
	}
	async signup(req, res) {
		try {
			const data = registerSchema.validate(req.body);
			console.log(data);
			const userExist = await prisma.user.findUnique({
				where: {
					email: data.value.email
				}
			});
			if (userExist) {
				res.status(444).json({
					message: "Current email already in use, please login"
				})
			}
			const hash = await bcrypt.hash(data.value.password, 10);
			const access_token = generateAccessToken(data.value.email);
			const refresh_token = generateRefreshToken(data.value.email);
			const user = await prisma.user.create({
				data: {
					email: data.value.email,
					hash: hash,
					refreshToken: refresh_token
				}
			})
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
			res.status(200).json({
				message: "User registered successfully",
				result: user
			})
		} catch (error) {
			res.status(402).json({
				message: "Cannot sing up new user",
				error: error.message
			})
		}
	}

	async signin(req, res) {
		try {
			const inputData = loginSchema.validate(req.body);
			const foundUser = await prisma.user.findUnique({
				where: {
					email: inputData.value.email
				}
			});
			const correctPassword = await bcrypt.compare(inputData.value.password, foundUser.hash)
			if (!correctPassword) {
				throw new Error("Wrong password or email!");
			}
			if (!foundUser) {
				throw new Error("Wrong password or email!");
			}
			const access_token = generateAccessToken(inputData.value.email);
			const refresh_token = generateRefreshToken(inputData.value.email);
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
			res.status(200).json({
				message: "Loged in successfully",
				data: foundUser
			})
		} catch (error) {
			res.status(402).json({
				error: error.message
			})
		}
	}
}

module.exports = new User();