const Joi = require('joi');
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const { generateStaffAccessToken, generateStaffRefreshToken } = require('../utils/token');
const config = require("../config/index");


const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	role_name: Joi.string().required(),
	description: Joi.string(),
	password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
	repeat_password: Joi.ref('password')
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
})

class Staff {
	constructor() {
		this.signup = this.signup.bind(this);
		this.signin = this.signin.bind(this);
	}
	async signup(req, res) {
		const { error } = registerSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			}
			const inputData = req.body;
			const hash = await bcrypt.hash(inputData.password, 10);
			const staff = await prisma.staff.create({
				data: {
					email: inputData.email,
					firstName: inputData.first_name,
					lastName: inputData.last_name,
					hash: hash,
					refreshToken: refresh_token,
					role: {
						create: {
							name: config.admin_secret == inputData.role_name ? "ADMIN" : inputData.role_name,
							description: inputData.description
						}
					}
				}
			})
			const access_token = generateStaffAccessToken(staff.roleId, inputData.email);
			const refresh_token = generateStaffRefreshToken(inputData.email);
			res.cookie("refreshToken", refresh_token, {
				maxAge: 1000 * 60 * 60 * 24 * 30,
				secure: false,
				httpOnly: true
			});
			res.cookie("accessToken", access_token, {
				maxAge: 60 * 60 * 1000,
				secure: false,
				httpOnly: true
			});
			res.status(200).json({
				message: "Staff registered successfully",
				result: staff
			})
		} catch (error) {
			res.status(402).json({
				message: "Cannot sing up new staff",
				error: error.message
			})
		}
	}

	async signin(req, res) {
		const { error } = loginSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			}
			const inputData = req.body;
			const foundStaff = await prisma.staff.findUnique({
				where: {
					email: inputData.email
				}
			});
			if (!foundStaff) {
				throw new Error("Wrong password or email!");
			}
			const correctPassword = await bcrypt.compare(inputData.password, foundStaff.hash)
			if (!correctPassword) {
				throw new Error("Wrong password or email!");
			}
			const refresh_token = generateStaffRefreshToken(inputData.email);
			const updateResult = await prisma.staff.update({
				where: {
					email: inputData.email
				},
				data: {
					refreshToken: refresh_token
				},
				select: {
					id: true,
					roleId: true,
					email: true
				}
			});
			const access_token = generateStaffAccessToken(updateResult.roleId, updateResult.email);
			res.cookie("accessToken", access_token, {
				maxAge: 60 * 60 * 24 * 1000,
				secure: false,
				httpOnly: true
			});
			res.cookie("refreshToken", refresh_token, {
				maxAge: 1000 * 60 * 60 * 24 * 30,
				secure: false,
				httpOnly: true
			});
			res.status(200).json({
				message: "Loged in successfully",
				data: foundStaff,
				update: updateResult
			})
		} catch (error) {
			res.status(402).json({
				error: error.message
			})
		}
	}
}

module.exports = new Staff();