const prisma = new PrismaClient()

async function main() {
	// Создание сотрудника (кассир)
	const cashier = await prisma.staff.create({
		data: {
			name: 'John Doe',
			email: 'john.doe@example.com',
			role: {
				create: {
					name: 'Cashier',
					description: 'Handles ticket sales at the counter'
				}
			}
		}
	})

	// Создание пользователя (покупатель)
	const user = await prisma.user.create({
		data: {
			email: 'alice@example.com',
			name: 'Alice'
		}
	})

	// Создание фильма и сеанса
	const movie = await prisma.movie.create({
		data: {
			title: 'Inception',
			duration: 148
		}
	})

	const screening = await prisma.screening.create({
		data: {
			startTime: new Date('2024-10-18T20:00:00.000Z'),
			movie: { connect: { id: movie.id } }
		}
	})

	// Создание места
	const seat = await prisma.seat.create({
		data: {
			number: 5,
			row: 'B'
		}
	})

	// Продажа билета в кассе
	const ticket = await prisma.ticket.create({
		data: {
			user: { connect: { id: user.id } },
			screening: { connect: { id: screening.id } },
			seat: { connect: { id: seat.id } },
			status: 'PAID',
			purchaseType: 'OFFLINE',
			soldBy: { connect: { id: cashier.id } }
		}
	})

	console.log('Ticket sold at the counter:', ticket)
}

main()
	.catch(e => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
