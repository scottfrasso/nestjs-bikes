import { HttpException, HttpStatus } from '@nestjs/common'

export class PlatformCustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode)
  }
}

export class BikeUnavailableException extends PlatformCustomHttpException {
  constructor() {
    super('Bike is unavailable', HttpStatus.CONFLICT)
  }
}

export class TooManyBookingsException extends PlatformCustomHttpException {
  constructor() {
    super('Too many bookings', HttpStatus.CONFLICT)
  }
}

export class InvalidUserException extends PlatformCustomHttpException {
  constructor() {
    super('Invalid user', HttpStatus.UNAUTHORIZED)
  }
}
