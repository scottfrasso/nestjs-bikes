import { Controller, Post, Body, UseGuards } from '@nestjs/common'

import {
  AuthorizedUserDTO,
  BikeRentalSearchRequestDTO,
  CreateRentalDTO,
} from '../dtos'
import { BikesService } from './bikes.service'
import { GetUser, UserGuard } from '../auth'
import { InvalidUserException } from '../utils/errors'

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikeService: BikesService) {}

  @Post()
  @UseGuards(UserGuard)
  async create(
    @Body() createRentalDto: CreateRentalDTO,
    @GetUser() user: AuthorizedUserDTO,
  ) {
    if (user.userId !== createRentalDto.userId) {
      throw new InvalidUserException()
    }

    return await this.bikeService.createRental(createRentalDto)
  }

  @Post('search')
  async search(@Body() searchRequest: BikeRentalSearchRequestDTO) {
    return await this.bikeService.search(searchRequest)
  }
}
