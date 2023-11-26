import { IsUUID, IsDateString } from 'class-validator'

export class CreateRentalDTO {
  @IsUUID()
  userId: string

  @IsUUID()
  bikeId: string

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date
}

export class BookingDTO {
  id: string
  userId: string
  bikeId: string
  cost: number
  locationId: string
  startDate: string
  endDate: string
}
