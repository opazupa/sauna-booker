import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const { timezone } = Configuration.booking;

export const BOOKING_WEEKS_AHEAD = 4;
const BOOKING_OPENING_HOUR = 1;

/**
 * Get time in the configured booking time zones
 *
 * @returns {DateTime}
 */
export const getBookingZoneTime = (): DateTime => {
  return DateTime.fromObject({
    zone: timezone,
  });
};

/**
 * Get time in the configured booking time zone 4 weeks from nows
 *
 * @returns {DateTime}
 */
export const getBookingSlotDate = (): DateTime => {
  return DateTime.fromObject({
    zone: timezone,
  })
    .plus({ weeks: BOOKING_WEEKS_AHEAD })
    .set({ second: 0, minute: 0 });
};

/**
 * Are bookings opened for the day
 *
 * @returns {boolean}
 */
export const bookingsOpened = (): boolean => getBookingZoneTime().hour === BOOKING_OPENING_HOUR;
