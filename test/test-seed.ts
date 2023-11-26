import { PrismaClient } from '@prisma/client'

export const seedData = {
  bike1: '2f26132c-122c-4995-9fc9-0493c2ed13a0',
  bike2: 'f3b2b3a0-0b0a-4e1a-9b0a-9e9b0a0b0a0b',
  bike3: 'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0',
  bike4: 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0',
  location1: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a',
  location2: '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b',
  location3: '3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c',
  location4: '4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d',
  userId1: '1e1e1e1e-1e1e-1e1e-1e1e-1e1e1e1e1e1e',
  userId2: '2f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f',
  userId3: '3g3g3g3g-3g3g-3g3g-3g3g-3g3g3g3g3g3g',
}

export const seedTestDB = async (prisma: PrismaClient) => {
  // Clear existing data
  await prisma.$transaction(async (transaction) => {
    await transaction.booking.deleteMany({})
    await transaction.bike.deleteMany({})
    await transaction.location.deleteMany({})
    await transaction.user.deleteMany({})

    // Seed Users
    await transaction.user.createMany({
      data: [
        { id: seedData.userId1, name: 'John', token: 'my_secret_token_123' },
        { id: seedData.userId2, name: 'Maria', token: 'MariasSecretToken' },
        { id: seedData.userId3, name: 'Tomy', token: '1234' },
      ],
      skipDuplicates: true, // This will skip entries with duplicate IDs
    })

    // Seed Locations
    await transaction.location.createMany({
      data: [
        { id: seedData.location1, name: 'Harbor' },
        { id: seedData.location2, name: 'Airport' },
        { id: seedData.location3, name: 'Park' },
        { id: seedData.location4, name: 'Hall' },
      ],
      skipDuplicates: true,
    })

    // Seed Bikes
    await transaction.bike.createMany({
      data: [
        {
          id: seedData.bike1,
          type: 'electric',
          pricePerDay: 10,
          locationId: seedData.location1,
        },
        {
          id: seedData.bike2,
          type: 'classic',
          pricePerDay: 3,
          locationId: seedData.location2,
        },
        {
          id: seedData.bike3,
          type: 'modern',
          pricePerDay: 5,
          locationId: seedData.location3,
        },
        {
          id: seedData.bike4,
          type: 'classic',
          pricePerDay: 3,
          locationId: seedData.location4,
        },
      ],
      skipDuplicates: true,
    })

    await transaction.booking.createMany({
      data: [
        {
          id: '7e93adcf-f352-4b5e-bcab-1c1ad88e3d71',
          userId: seedData.userId2,
          bikeId: seedData.bike1,
          cost: 50,
          startDate: new Date('2023-11-25'),
          endDate: new Date('2023-11-29'),
        },
        {
          id: '82f9d6fd-30ce-45b3-92c9-0daca8e3ec56',
          userId: seedData.userId3,
          bikeId: seedData.bike2,
          cost: 20,
          startDate: new Date('2023-12-01'),
          endDate: new Date('2023-12-01'),
        },
      ],
      skipDuplicates: true,
    })
  })
}
