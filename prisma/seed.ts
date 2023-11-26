import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.location.deleteMany({})
  await prisma.bike.deleteMany({})

  const users = ['John', 'Maria', 'Tomy']

  // Seed Users
  for (const user of users) {
    await prisma.user.create({
      data: {
        name: user,
        token: `${user}sSecretToken`,
      },
    })
  }

  // Seed Locations
  const location1 = await prisma.location.create({
    data: {
      name: 'Harbor',
    },
  })
  const location2 = await prisma.location.create({
    data: {
      name: 'Airport',
    },
  })
  const location3 = await prisma.location.create({
    data: {
      name: 'Park',
    },
  })
  const location4 = await prisma.location.create({
    data: {
      name: 'Hall',
    },
  })

  // Seed Bikes
  await prisma.bike.createMany({
    data: [
      { type: 'electric', pricePerDay: 10, locationId: location1.id },
      { type: 'classic', pricePerDay: 3, locationId: location2.id },
      { type: 'modern', pricePerDay: 5, locationId: location3.id },
      { type: 'classic', pricePerDay: 3, locationId: location4.id },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
