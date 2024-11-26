const Joi = require('joi');
const prisma = require('../utils/prisma');

const movieSchema = Joi.object({
	title: Joi.string().required(),
	duration: Joi.string().required(),
	description: Joi.string().optional(),
})

class Movie {
	constructor() {
		this.create = this.create.bind(this)
		this.update = this.update.bind(this)
		this.get = this.get.bind(this)
		this.getall = this.getAll.bind(this)
		this.delete = this.delete.bind(this)
	}
	async create(req, res) {
		const { error } = movieSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			};
			const data = req.body;
			const createResult = await prisma.movie.create({
				data: {
					title: data.title,
					description: data.description,
					duration: parseInt(data.duration)
				},
				select: {
					title: true,
					duration: true,
					description: true
				}
			});
			console.log(createResult)
			res.status(200).json({
				message: "Movie added successfully",
				data: createResult
			})
		} catch (error) {
			res.status(400).json({
				message: "Cannot add the movie",
				error: error.message
			})
		}

	}
	async update(req, res) {
		const { error } = movieSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			}
			const data = req.body;
			const updateResult = await prisma.movie.update({
				where: {
					id: data.id
				},
				data: {
					title: data.title,
					description: data.description,
					duration: parseInt(data.duration)
				}
			});
			res.status(200).json({
				message: "The movie updated successfully",
				data: updateResult
			});
		} catch (error) {
			res.status(400).json({
				message: "Cannot update the movie",
				error: error.message
			})
		}
	}
	async get(req, res) {
		try {
			const id = req.params.id;
			if (!id) {
				throw new Error("Id of the movie not provided");
			}
			const getResult = await prisma.movie.findUnique({
				where: {
					id
				}
			});
			res.status(200).json({
				data: getResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Cannot find the movie"
			})
		}
	}
	async getAll(req, res) {
		try {
			const getAllResult = await prisma.movie.findMany({});
			res.status(200).json({
				data: getAllResult
			})
		} catch (error) {
			res.status(404).json(
				{
					message: "Cannot get all movies",
					error: error.message
				}
			)
		}
	}
	async delete(req, res) {
		const id = req.params.id;
		try {
			if (!id) {
				throw new Error("Id of the movie not provided");
			}
			const deleteResult = await prisma.movie.delete({
				where: {
					id
				}
			});
			res.status(200).json({
				message: "Movie deleted successfully",
				data: deleteResult
			});
		} catch (error) {
			res.status(404).json({
				message: "Cannot delete the movie",
				error: error.message
			})
		}
	}
}

module.exports = new Movie()