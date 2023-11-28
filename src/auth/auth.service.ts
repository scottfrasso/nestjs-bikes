import { Injectable, Inject } from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

import { UserDBO } from '../data'
import { PRISMA } from '../provider-names'

@Injectable()
export class AuthService {
  constructor(@Inject(PRISMA) private prisma: PrismaClient) {}

  async validateUser(userId: string, token: string): Promise<UserDBO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, token },
    })
    if (!user) {
      return null
    }
    return user
  }
}
