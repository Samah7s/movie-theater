const Joi = require('joi');
const prisma = require('../utils/prisma');

const seatSchema = Joi.object({
	row: Joi.string().required(),
	number: Joi.number().required(),
})

const seatsSchema = Joi.array().items(
	Joi.object({
		row: Joi.string().required(),
		number: Joi.number().required()
	})
)


class Seat {
	constructor() {
		this.createOne = this.createOne.bind(this);
		this.createMany = this.createMany.bind(this);
		this.update = this.update.bind(this);
		this.get = this.get.bind(this);
		this.getAll = this.getAll.bind(this);
		this.delete = this.delete.bind(this);

	}
	async createOne(req, res) {
		const { error } = seatSchema.validate(req.body);
		try {
			if (error) {
				throw new Error('wrong data');
			}
			const inputData = req.body;
			console.log(inputData.row);
			const createResult = await prisma.seat.create({
				data: inputData
			})
			res.status(200).json({
				message: "Seats created successfully",
				data: createResult
			})
		} catch (error) {
			res.status(402).json({
				message: "Cannot create seat",
				error: error.message
			})
		}
	}
	async createMany(req, res) {
		const { error } = seatsSchema.validate(req.body.array);
		console.log(req.body.array);
		try {
			if (error) {
				throw new Error('wrong data');
			}
			const inputData = req.body.array;
			const createResult = await prisma.seat.createMany({
				data: inputData,
				skipDuplicates: true,
				select: {
					row: true,
					number: true
				}
			})
			res.status(200).json({
				message: "Seats created successfully",
				data: createResult
			})
		} catch (error) {
			res.status(402).json({
				message: "Cannot create seat",
				error: error.message
			})
		}
	}
	async update(req, res) {
		const id = req.params.id;
		try {
			if (!id) {
				throw new Error("id not provided");
			}
			const { error } = seatSchema.validate(req.body);
			if (error) {
				throw new Error(error);
			}
			const inputData = req.body;
			const updateResult = await prisma.seat.update({
				where: {
					id
				},
				data: {
					rows: inputData.row,
					number: Number(inputData.number)
				}
			})
			res.status(200).json({
				message: "updated successfully",
				data: updateResult
			})
		} catch (error) {
			res.status(402).json({
				error: error.message
			})
		}
	}
	async get(req, res) {
		const id = req.params.id;
		try {
			const getResult = await prisma.seat.findUnique({
				where: {
					id
				}
			});
			res.status(200).json({
				data: getResult
			})
		} catch (error) {
			res.status(402).json({
				error: error.message
			})
		}
	}
	async getAll(req, res) {
		try {
			const getAllResult = await prisma.seat.findMany({});
			res.status(200).json({
				message: "Requested all seats",
				data: getAllResult
			})
		} catch (error) {
			res.status(402).json({
				message: "Cannot get seats",
				error: error
			})
		}
	}
	async delete(req, res) {
		const id = req.params.id;
		try {
			const deleteResult = await prisma.seat.delete({
				where: {
					id
				}
			});
			res.status(200).json({
				message: "Deleted successfully",
				data: deleteResult
			})
		} catch (error) {
			res.status(402).json({
				message: "Delete failure",
				error: error.message
			})
		}
	}
}

module.exports = new Seat();