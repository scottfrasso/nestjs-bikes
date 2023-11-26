import { Controller, Post, Body } from '@nestjs/common'

import { CreateRentalDTO } from '../dtos'

@Controller('bikes')
export class BikesController {
  @Post()
  async create(@Body() createRentalDto: CreateRentalDTO) {
    // Your logic here
    return 'Rental created'
  }
}
