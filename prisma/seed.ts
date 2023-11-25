import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.user.deleteMany({})
  await prisma.location.deleteMany({})
  await prisma.bike.deleteMany({})

  // Seed Users
  await prisma.user.createMany({
    data: [
      { id: 1, name: 'John', token: 'my_secret_token_123' },
      { id: 2, name: 'Maria', token: 'MariasSecretToken' },
      { id: 3, name: 'Tomy', token: '1234' },
    ],
    skipDuplicates: true, // This will skip entries with duplicate IDs
  })

  // Seed Locations
  await prisma.location.createMany({
    data: [
      { id: 1, name: 'Harbor' },
      { id: 2, name: 'Airport' },
      { id: 3, name: 'Park' },
      { id: 4, name: 'Hall' },
    ],
    skipDuplicates: true,
  })

  // Seed Bikes
  await prisma.bike.createMany({
    data: [
      { id: 1, type: 'electric', pricePerDay: 10 },
      { id: 2, type: 'classic', pricePerDay: 3 },
      { id: 3, type: 'modern', pricePerDay: 5 },
      { id: 4, type: 'classic', pricePerDay: 3 },
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
