import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { BikesModule } from './bikes/bikes.module'
import { LocationsModule } from './locations/locations.module'
import { DataModule } from './data/data.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [BikesModule, LocationsModule, DataModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
