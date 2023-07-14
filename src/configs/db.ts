import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.users.create({
    data:
			{
				username: 'mano_tata',
				email: 'mano@tata.com',
				password: '278832'
			}
    }
	);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })