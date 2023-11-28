import { Injectable, Inject } from '@nestjs/common'
import {
  startOfDay,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
} from 'date-fns'

import { PrismaClient } from '@prisma/client'

import { BookingDTO, CreateRentalDTO } from '../dtos'
import { PRISMA } from '../provider-names'
import { logger } from '../logging/logger'
import { getCurrentDate } from '../utils/date'
import {
  BikeUnavailableException,
  TooManyBookingsException,
} from '../utils/errors'

const MAX_BOOKINGS_PER_USER = 3
const MAX_UNITS_PER_MONTH = 100

@Injectable()
export class BikesService {
  constructor(@Inject(PRISMA) private prisma: PrismaClient) {}

  /**
   * Requirements:
   *
   * - Each citizen could spend 100 units of currency per calendar month on a rides.
   * - Paid booking are not supported yet.
   * - Booking time unit is a day.
   * - Same bike bookings cannot overlap.
   * - Bookings of a single person can't overlap.
   * - A person could have no more than 3 bookings scheduled in the future.
   * - Bikes and locations data is public, but bookings require token.
   * - Booking need to be made at least three days ahead.
   *
   * @param createRentalDto The bike rental to create
   * @returns The created bike rental
   */
  async createRental(createRentalDto: CreateRentalDTO): Promise<BookingDTO> {
    const { startDate, endDate, userId, bikeId } = createRentalDto
    logger.info('Creating rental', createRentalDto)

    // Check that the booking is at least 3 days ahead
    const now = getCurrentDate()
    const daysUntilBooking = differenceInCalendarDays(
      startOfDay(startDate),
      now,
    )
    if (daysUntilBooking < 3) {
      throw new Error('Booking must be at least 3 days ahead')
    }

    return await this.prisma.$transaction(async (transaction) => {
      logger.info('Starting transaction')
      // Check that the user exists
      const user = await transaction.user.findUnique({
        where: { id: userId },
        include: {
          bookings: {
            where: {
              startDate: {
                gte: now,
              },
            },
          },
        },
      })

      if (!user) {
        throw new Error('Invalid user')
      }

      if (user.bookings.length + 1 >= MAX_BOOKINGS_PER_USER) {
        throw new TooManyBookingsException()
      }

      // Check that the bike exists
      const bike = await transaction.bike.findUnique({
        where: { id: bikeId },
        include: {
          location: true,
        },
      })
      if (!bike) {
        throw new Error('Invalid bike')
      }

      if (!bike.location) {
        throw new Error('Bike is not available')
      }

      // Check that the bike is available
      const overlappingBookings: { id: number }[] = await transaction.$queryRaw`
        SELECT "public"."Booking"."id"
        FROM "public"."Booking" 
        WHERE ("public"."Booking"."bikeId" = ${bikeId}
          AND date_trunc('day', "public"."Booking"."startDate"::timestamp) <= date_trunc('day', ${endDate}::timestamp)
          AND date_trunc('day', "public"."Booking"."endDate"::timestamp) >= date_trunc('day', ${startDate}::timestamp)) 
        ORDER BY "public"."Booking"."id";
      `

      if (overlappingBookings.length > 0) {
        logger.debug('Bike is not available', {
          overlappingBookings,
        })
        throw new BikeUnavailableException()
      }

      // Check that the user has enough units
      const bookingsForStartMonth = await transaction.booking.aggregate({
        where: {
          userId,
          startDate: {
            gte: startOfDay(startOfMonth(startDate)),
            lte: startOfDay(endOfMonth(startDate)),
          },
        },
        _sum: {
          cost: true,
        },
      })

      const costOfUnitsForBookingMonth = bookingsForStartMonth._sum.cost || 0

      const daysForBooking = differenceInCalendarDays(endDate, startDate) + 1
      const costOfBooking = daysForBooking * bike.pricePerDay

      if (costOfUnitsForBookingMonth + costOfBooking > MAX_UNITS_PER_MONTH) {
        throw new Error('Not enough units')
      }

      logger.info('Creating booking', {
        userId,
        bikeId,
        startDate,
        endDate,
        costOfBooking,
      })

      // Create the booking
      const createdBooking = await transaction.booking.create({
        data: {
          userId,
          bikeId,
          cost: costOfBooking,
          startDate,
          endDate,
        },
      })

      return {
        id: createdBooking.id,
        userId: createdBooking.userId,
        bikeId: createdBooking.bikeId,
        locationId: bike.locationId,
        cost: createdBooking.cost,
        startDate: createdBooking.startDate.toISOString(),
        endDate: createdBooking.endDate.toISOString(),
      }
    })
  }
}
