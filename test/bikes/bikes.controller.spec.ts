import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'

import { PrismaClient } from '@prisma/client'

import { DataModule } from '../../src/data'
import { AuthModule } from '../../src/auth'
import { seedData, seedTestDB } from '../test-seed'
import { PRISMA } from '../../src/provider-names'
import { BikesController, BikesService } from '../../src/bikes'
import { BikeRentalSearchResponseDTO, CreateRentalDTO } from '../../src/dtos'

describe('BikesController', () => {
  let app: INestApplication
  let controller: BikesController
  let bikeService: BikesService
  let prisma: PrismaClient
  let createRentalSpy: jest.SpyInstance

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModule, AuthModule],
      controllers: [BikesController],
      providers: [BikesService],
    }).compile()

    controller = module.get<BikesController>(BikesController)
    bikeService = module.get<BikesService>(BikesService)
    createRentalSpy = jest.spyOn(bikeService, 'createRental')
    prisma = module.get(PRISMA)

    await seedTestDB(prisma)

    app = module.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    await app.init()
  })

  afterEach(async () => {
    createRentalSpy.mockClear()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('POST /bikes', () => {
    it('should validate a user', async () => {
      const bikeRentalRequest: CreateRentalDTO = {
        userId: seedData.userId1,
        bikeId: seedData.bike1,
        startDate: new Date(),
        endDate: new Date(),
      }

      createRentalSpy.mockResolvedValueOnce({
        id: '7e93adcf-f352-4b5e-bcab-1c1ad88e3d71',
        userId: seedData.userId1,
        bikeId: seedData.bike1,
        startDate: new Date(),
        endDate: new Date(),
        cost: 100,
      })

      await request(app.getHttpServer())
        .post('/bikes')
        .send(bikeRentalRequest)
        .set('Authorization', `Bearer ${seedData.user1Token}`)
        .expect(201)

      expect(createRentalSpy).toHaveBeenCalled()
    })

    it('should throw an error for an invalid token', async () => {
      const bikeRentalRequest: CreateRentalDTO = {
        userId: seedData.userId1,
        bikeId: seedData.bike1,
        startDate: new Date(),
        endDate: new Date(),
      }

      await request(app.getHttpServer())
        .post('/bikes')
        .send(bikeRentalRequest)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(createRentalSpy).not.toHaveBeenCalled()
    })

    it('should throw an error for invalid UUIDs', async () => {
      const bikeRentalRequest: CreateRentalDTO = {
        userId: 'invalid-uuid',
        bikeId: 'invalid-uuid',
        startDate: new Date(),
        endDate: new Date(),
      }

      await request(app.getHttpServer())
        .post('/bikes')
        .send(bikeRentalRequest)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(createRentalSpy).not.toHaveBeenCalled()
    })

    it('should throw an error for invalid dates', async () => {
      await request(app.getHttpServer())
        .post('/bikes')
        .send({
          userId: seedData.userId1,
          bikeId: seedData.bike1,
          startDate: new Date(),
          endDate: 'not-a-date',
        })
        .set('Authorization', `Bearer ${seedData.user1Token}`)
        .expect(400)

      expect(createRentalSpy).not.toHaveBeenCalled()
    })
  })

  describe('POST /bikes/search', () => {
    it('should search for bikes', async () => {
      const startDate1 = new Date('2023-12-01')

      const response = await request(app.getHttpServer())
        .post('/bikes/search')
        .send({
          startDate: startDate1,
          endDate: startDate1,
        })
        .set('Authorization', `Bearer ${seedData.user1Token}`)
        .expect(201)

      const results = response.body as BikeRentalSearchResponseDTO

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
