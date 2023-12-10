import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common'

import { AuthorizedUserDTO, CreateRentalDTO } from '../dtos'
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
}
