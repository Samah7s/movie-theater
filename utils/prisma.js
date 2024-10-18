const { PrismaClient } = require('@prisma/client');

let prisma;

if (typeof window === "undefined") {
	if (process.env.NODE_ENV === "production") {
		prisma = new PrismaClient();
	} else {
		let globalWithPrisma = global
		if (!globalWithPrisma.prisma) {
			globalWithPrisma.prisma = new PrismaClient();
		}
		prisma = globalWithPrisma.prisma;
	}
}

module.exports = prisma;
