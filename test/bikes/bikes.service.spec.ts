import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'

import { BikesService } from '../../src/bikes/bikes.service'
import { DataModule } from '../../src/data/data.module'
import { PRISMA } from '../../src/provider-names'
import { seedData, seedTestDB } from '../test-seed'
import * as dateUtils from '../../src/utils/date'
import {
  BikeUnavailableException,
  TooManyBookingsException,
} from '../../src/utils/errors'

describe('BikesService', () => {
  let service: BikesService
  let prisma: PrismaClient
  let mockDate: Date

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [BikesService],
    }).compile()

    service = module.get<BikesService>(BikesService)
    prisma = module.get(PRISMA)

    await seedTestDB(prisma)

    mockDate = new Date('2023-11-25')
    jest.spyOn(dateUtils, 'getCurrentDate').mockImplementation(() => mockDate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createRental', () => {
    it('should create a rental', async () => {
      const startDate = new Date('2023-12-01')
      const endDate = new Date('2023-12-01')
      const userId = seedData.userId1
      const bikeId = seedData.bike1

      const rentalDTO = await service.createRental({
        startDate,
        endDate,
        userId,
        bikeId,
      })

      const rentals = await prisma.booking.findMany({
        where: { userId },
      })
      expect(rentals.length).toEqual(1)
      const rental = rentals[0]
      expect(rental.id).toEqual(rentalDTO.id)
      expect(rental.cost).toEqual(rentalDTO.cost)
      expect(rental.startDate).toEqual(startDate)
      expect(rental.endDate).toEqual(endDate)
      expect(rental.userId).toEqual(userId)
      expect(rental.bikeId).toEqual(bikeId)
    })

    it('should not create a duplicate rental', async () => {
      const startDate = new Date('2024-12-15')
      const endDate = new Date('2024-12-15')
      const userId = seedData.userId1
      const bikeId = seedData.bike1

      await service.createRental({
        startDate,
        endDate,
        userId,
        bikeId,
      })

      await expect(
        service.createRental({
          startDate,
          endDate,
          userId,
          bikeId,
        }),
      ).rejects.toThrow(BikeUnavailableException)

      const rentals = await prisma.booking.findMany({
        where: { userId },
      })
      expect(rentals.length).toEqual(1)
    })

    it('should make two bookings', async () => {
      const startDate1 = new Date('2024-12-15')
      const userId = seedData.userId1
      const bikeId = seedData.bike1

      await service.createRental({
        startDate: startDate1,
        endDate: startDate1,
        userId,
        bikeId,
      })

      const startDate2 = new Date('2024-12-16')

      await service.createRental({
        startDate: startDate2,
        endDate: startDate2,
        userId,
        bikeId,
      })

      const rentals = await prisma.booking.findMany({
        where: { userId },
      })

      expect(rentals.length).toEqual(2)
    })

    it('should not create a rental because the bike is already booked', async () => {
      const startDate = new Date('2023-11-29')
      const endDate = new Date('2023-12-15')
      const userId = seedData.userId1
      const bikeId = seedData.bike2

      await expect(
        service.createRental({
          startDate,
          endDate,
          userId,
          bikeId,
        }),
      ).rejects.toThrow(BikeUnavailableException)

      const rentals = await prisma.booking.findMany({
        where: { userId },
      })
      expect(rentals.length).toEqual(0)
    })

    it('should not create a rental because the customer has too many bookings', async () => {
      const startDate = new Date('2023-11-29')
      const endDate = new Date('2023-12-15')
      const userId = seedData.userId1
      const bikeId = seedData.bike2

      await prisma.booking.createMany({
        data: [
          {
            userId: seedData.userId1,
            bikeId: seedData.bike1,
            cost: 50,
            startDate: new Date('2023-12-01'),
            endDate: new Date('2023-12-02'),
          },
          {
            userId: seedData.userId1,
            bikeId: seedData.bike2,
            cost: 20,
            startDate: new Date('2023-12-05'),
            endDate: new Date('2023-12-12'),
          },
          {
            userId: seedData.userId1,
            bikeId: seedData.bike3,
            cost: 20,
            startDate: new Date('2023-12-14'),
            endDate: new Date('2023-12-15'),
          },
        ],
      })

      await expect(
        service.createRental({
          startDate,
          endDate,
          userId,
          bikeId,
        }),
      ).rejects.toThrow(TooManyBookingsException)

      const rentals = await prisma.booking.findMany({
        where: { userId },
      })
      expect(rentals.length).toEqual(3)
    })
  })

  describe('getAvailableBikes', () => {
    it('should search for open bikes', async () => {
      const startDate1 = new Date('2024-7-15')

      const results = await service.search({
        startDate: startDate1,
        endDate: startDate1,
      })

      expect(results).toBeDefined()
      expect(results.bikes.length).toEqual(4)

      const result1 = results.bikes[0]
      expect(result1.id).toEqual(seedData.bike2)
      expect(result1.locationId).toEqual(seedData.location2)

      const result2 = results.bikes[1]
      expect(result2.id).toEqual(seedData.bike4)
      expect(result2.locationId).toEqual(seedData.location4)

      const result3 = results.bikes[2]
      expect(result3.id).toEqual(seedData.bike3)
      expect(result3.locationId).toEqual(seedData.location3)

      const result4 = results.bikes[3]
      expect(result4.id).toEqual(seedData.bike1)
      expect(result4.locationId).toEqual(seedData.location1)
    })

    it('should search for bikes at location #1', async () => {
      const startDate1 = new Date('2024-7-15')

      const results = await service.search({
        startDate: startDate1,
        endDate: startDate1,
        locationIds: [seedData.location1],
      })

      expect(results).toBeDefined()
      expect(results.bikes.length).toEqual(1)

      const result1 = results.bikes[0]
      expect(result1.id).toEqual(seedData.bike1)
      expect(result1.locationId).toEqual(seedData.location1)
    })

    it('should search for bikes with a price per day of 10', async () => {
      const startDate1 = new Date('2024-7-15')

      const results = await service.search({
        startDate: startDate1,
        endDate: startDate1,
        pricePerDayMin: 10,
      })

      expect(results).toBeDefined()
      expect(results.bikes.length).toEqual(1)

      const result1 = results.bikes[0]
      expect(result1.id).toEqual(seedData.bike1)
      expect(result1.locationId).toEqual(seedData.location1)
    })

    it('should search for bikes that are available', async () => {
      const startDate1 = new Date('2023-12-01')

      const results = await service.search({
        startDate: startDate1,
        endDate: startDate1,
      })

      expect(results).toBeDefined()
      expect(results.bikes.length).toEqual(3)

      const result1 = results.bikes[0]
      expect(result1.id).toEqual(seedData.bike4)
      expect(result1.locationId).toEqual(seedData.location4)

      const result2 = results.bikes[1]
      expect(result2.id).toEqual(seedData.bike3)
      expect(result2.locationId).toEqual(seedData.location3)

      const result3 = results.bikes[2]
      expect(result3.id).toEqual(seedData.bike1)
      expect(result3.locationId).toEqual(seedData.location1)
    })
  })
})
