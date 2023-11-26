import { Module } from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

import { PRISMA } from '../provider-names'

@Module({
  providers: [
    {
      provide: PRISMA,
      useValue: new PrismaClient(),
    },
  ],
  exports: [PRISMA],
})
export class DataModule {}
