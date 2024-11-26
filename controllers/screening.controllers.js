const Joi = require('joi');
const prisma = require('../utils/prisma');

const screeningSchema = Joi.object({
	startTime: Joi.string().required(),
	movieId: Joi.string().required(),
})

class Screening {
	constructor() {
		this.create = this.create.bind(this);
		this.get = this.get.bind(this);
		this.getAll = this.getAll.bind(this);
		this.delete = this.delete.bind(this);
	}
	async create(req, res) {
		const { error } = screeningSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			};
			const data = req.body;
			const createResult = await prisma.screening.create({
				data: {
					startTime: new Date(data.startTime),
					movie: {
						connect: {
							id: parseInt(data.movieId)
						}
					}
				}
			});
			res.status(200).json({
				message: "Screening listed successfully",
				data: createResult
			})
		} catch (error) {
			res.status(500).json({
				message: "cannot list screening",
				error: error.message
			})
		}
	}
	async get(req, res) {
		const id = req.params.id;
		try {
			if (!id) {
				throw new Error("Id of the film not provided");
			}
			const getResult = await prisma.screening.findUnique({
				where: { id }
			});
			res.status(200).json({
				message: "Current screening of the this film",
				data: getResult
			})
		} catch (error) {
			res.status(500).json({
				message: "Cannot get screening",
				error: error.message
			})
		}
	}
	async getAll(req, res) {
		try {
			const getAllResult = await prisma.screening.findMany({});
			res.status(200).json({
				message: "Current screenings",
				data: getAllResult
			})
		} catch (error) {
			res.status(500).json({
				message: "Cannot get screening",
				error: error.message
			})
		}
	}
	async update(req, res) {
		const id = req.params.id;
		try {
			if (!id) {
				throw new Error("Id of the screening not provided");
			}
			const { error } = screeningSchema.validate(req.body);
			if (error) {
				throw new Error(error);
			}
			const updateResult = await prisma.screening.update({
				where: {
					id
				},
				data: {
					startTime: new Date(data.startTime),
					movie: {
						connect: {
							id: parseInt(data.movieId)
						}
					}
				}
			});
			res.status(200).json({
				message: "Screening updated successfully",
				data: updateResult
			})
		} catch (error) {
			res.status(500).json({
				message: "Cannot update the screening",
				error: error.message
			})
		}
	}
	async delete(req, res) {
		const id = req.params.id;
		try {
			if (!id) {
				throw new Error("Id not provided");
			}
			const deleteResult = await prisma.screening.delete({
				where: {
					id
				}
			});
			res.status(200).json({
				message: "Deleted successfully",
				data: deleteResult
			})
		} catch (error) {
			res.status(500).json({
				message: "Cannot delete",
				error: error.message
			})
		}
	}
}

module.exports = new Screening();