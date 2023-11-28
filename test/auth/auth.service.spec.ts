import { Test, TestingModule } from '@nestjs/testing'

import { PrismaClient } from '@prisma/client'

import { DataModule } from '../../src/data'
import { AuthService } from '../../src/auth'
import { seedData, seedTestDB } from '../test-seed'
import { PRISMA } from '../../src/provider-names'

describe('AuthService', () => {
  let service: AuthService
  let prisma: PrismaClient

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModule],
      providers: [AuthService],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get(PRISMA)

    await seedTestDB(prisma)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should authenticate a user', async () => {
    const user = await service.validateUser(
      seedData.userId1,
      'my_secret_token_123',
    )
    expect(user).toBeDefined()
  })
})
