const Joi = require('joi');
const prisma = require('../utils/prisma');

const onlineTicketSchema = Joi.object({
	screeningId: Joi.number().required(),
	seatId: Joi.number().required()
});

const offlineTicketSchema = Joi.object({
	screeningId: Joi.number().required(),
	seatId: Joi.number().required(),
})

class Ticket {
	constructor() {
		this.createOnline = this.createOnline.bind(this);
		this.createOffline = this.createOffline.bind(this);
		this.update = this.update.bind(this);
		this.get = this.get.bind(this);
		this.getAll = this.get.bind(this);
		this.delete = this.delete.bind(this);
	}
	async createOnline(req, res) {
		const { error } = onlineTicketSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			}
			const data = req.body;
			const createResult = await prisma.ticket.create({
				data: {
					user: { connect: { id: req.userId } },
					screening: { connect: { id: data.screeningId } },
					seat: { connect: { id: data.seatId } },
					status: 'RESERVED',
					purchaseType: 'ONLINE',
					soldBy: null,
				}
			});
			res.status(200).json({
				mesagge: "Tikcet created successfully",
				data: createResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Tikcet creation failure",
				error: error.message
			})
		}
	}
	async createOffline(req, res) {
		const { error } = offlineTicketSchema.validate(req.body);
		try {
			if (error) {
				throw new Error(error);
			}
			const data = req.body;
			const createResult = await prisma.ticket.create({
				data: {
					user: null,
					screening: { connect: { id: data.screeningId } },
					seat: { connect: { id: data.seatId } },
					status: 'RESERVED',
					purchaseType: 'ONLINE',
					soldBy: req.staffId,
				}
			});
			res.status(200).json({
				mesagge: "Tikcet created successfully",
				data: createResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Tikcet creation failure",
				error: error.message
			})
		}
	}
	async update() { }
	async get(req, res) {
		try {
			const id = req.params.id;
			const getResult = await prisma.ticket.findUnique({
				where: {
					id
				}
			});
			res.status(200).json({
				message: "Tikcet obtained successfully",
				data: getResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Getiing opearation failure",
				error: error.message
			})
		}
	}
	async getAll(req, res) {
		try {
			const getAllResult = await prisma.ticket.findMany();
			res.status(200).json({
				message: "All tickets received",
				data: getAllResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Getting  opearation failure",
				error: error.message
			})
		}
	}
	async delete(req, res) {
		try {
			const id = req.params.id;
			const deleteResult = await prisma.ticket.delete({
				where: {
					id
				}
			});
			res.status(200).json({
				message: "Deleted successfully",
				data: deleteResult
			})
		} catch (error) {
			res.status(404).json({
				message: "Delete opearation failure",
				error: error.message
			})
		}
	}
}

module.exports = new Ticket();