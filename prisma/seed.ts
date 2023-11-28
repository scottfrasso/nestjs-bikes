import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany({})
  await prisma.bike.deleteMany({})
  await prisma.location.deleteMany({})
  await prisma.user.deleteMany({})

  const userData = [
    { name: 'John', id: 'b8d2a033-58db-4cdb-96f1-3bd63e50892f', token: '123' },
    { name: 'Maria', id: '8814da28-a7b8-49c1-b908-47f564825337', token: '456' },
    { name: 'Tomy', id: 'c33f832f-5df8-4bd8-937f-c4cdcb413ca5', token: '789' },
  ]

  // Seed Users
  await prisma.user.createMany({
    data: userData,
  })

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
      {
        id: 'e03b313e-6c98-41ea-ab1c-0c4e03afe60e',
        type: 'electric',
        pricePerDay: 10,
        locationId: location1.id,
      },
      {
        id: 'a7bb44e2-4a17-4f5f-a52a-1565c761a3a4',
        type: 'classic',
        pricePerDay: 3,
        locationId: location2.id,
      },
      {
        id: 'cf1cd512-b40d-49e1-874f-b05a8177e077',
        type: 'modern',
        pricePerDay: 5,
        locationId: location3.id,
      },
      {
        id: '7629ae62-986b-4fd4-ad0b-7503a22ccd71',
        type: 'classic',
        pricePerDay: 3,
        locationId: location4.id,
      },
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
