import { IsUUID, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateRentalDTO {
  @IsUUID()
  userId: string

  @IsUUID()
  bikeId: string

  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsDate()
  @Type(() => Date)
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
