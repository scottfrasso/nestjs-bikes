import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { BikesModule } from './bikes/bikes.module'
import { LocationsModule } from './locations/locations.module'

@Module({
  imports: [BikesModule, LocationsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
