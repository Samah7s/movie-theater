const Joi = require('joi');
const prisma = require('../utils/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const schema = Joi.object({
	email: Joi.string().email().required(),
	role: Joi.string().required(),
	name: Joi.string().required(),
	role_name: Joi.string().required()
})

class Staff {
	constructor() {
		this.signup = this.signup.bind(this);
		this.signin = this.signin.bind(this);
	}
	async signup(req, res) {
		try {
			const data = schema.validate(req.body);
			const staff = await prisma.staff.create({
				data: {
					email: data.value.email,
					name: data.value.name,
					role: {
						create: {
							name: data.value.role_name,
							description: data.value.description
						}
					}
				}
			})
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
		try {
			const inputData = schema.validate(req.body);
			const foundUser = await prisma.user.findUnique({
				where: {
					email: inputData.value.email
				}
			});
			if (!foundUser) {
				throw new Error("Staff not founded");
			}
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

module.exports = new Staff();