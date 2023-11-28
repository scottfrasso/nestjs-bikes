import { Module } from '@nestjs/common'

import { BikesService } from './bikes.service'
import { BikesController } from './bikes.controller'
import { AuthModule } from '../auth'
import { DataModule } from '../data'

@Module({
  imports: [AuthModule, DataModule],
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
