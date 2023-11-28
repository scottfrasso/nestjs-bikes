import { Controller, Post, Body, Headers } from '@nestjs/common'

import { CreateRentalDTO } from '../dtos'
import { BikesService } from './bikes.service'
import { AuthService } from '../auth'
import { InvalidUserException } from '../utils/errors'

@Controller('bikes')
export class BikesController {
  constructor(
    private readonly authService: AuthService,
    private readonly bikeService: BikesService,
  ) {}

  @Post()
  async create(
    @Headers('Authorization') token: string,
    @Body() createRentalDto: CreateRentalDTO,
  ) {
    // Given more time I'd make something to do this better
    const usersToken = token.split(' ')[1]
    const user = await this.authService.validateUser(
      createRentalDto.userId,
      usersToken,
    )
    if (!user) {
      throw new InvalidUserException()
    }

    return await this.bikeService.createRental(createRentalDto)
  }
}
