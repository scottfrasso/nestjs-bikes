import { IsUUID, IsDate, IsOptional } from 'class-validator'
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

export class BikeRentalSearchRequestDTO {
  @IsOptional()
  locationIds?: string[]

  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsDate()
  @Type(() => Date)
  endDate: Date

  @IsOptional()
  pricePerDayMin?: number

  @IsOptional()
  pricePerDayMax?: number
}

export class BikeRentalSearchItemDTO {
  id: string
  locationId: string
  pricePerDay: number
  location: {
    id: string
    name: string
  }
}

export class BikeRentalSearchResponseDTO {
  bikes: BikeRentalSearchItemDTO[]
}
