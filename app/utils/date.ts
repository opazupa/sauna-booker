import { DateTime } from 'luxon';

import { Configuration, SaunaDay } from '../configuration';

const { timezone, saunaDayPreferences } = Configuration.booking;

export const BOOKING_WEEKS_AHEAD = 4;
const WEEKLY_BOOKING_LIMIT = 2;
const BOOKING_OPENING_HOUR = 1;

/**
 * Check if sauna preference is configured for today
 *
 * @returns
 */
export const hasSaunaPreference = (): SaunaDay | null => {
  // Validate sauna configuration for debugging
  const configuredBookingCount = Object.values(saunaDayPreferences).reduce((a, b) => (b.double ? a + 2 : ++a), 0);
  if (configuredBookingCount > WEEKLY_BOOKING_LIMIT) {
    console.warn(`Weekly booking limit ${WEEKLY_BOOKING_LIMIT} exceeded with ${configuredBookingCount}.`);
  }
  return saunaDayPreferences[getBookingZoneTime().weekdayShort];
};

/**
 * Get time in the configured booking time zone
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
  }).plus({ weeks: BOOKING_WEEKS_AHEAD });
};

/**
 * Are bookings opened for the day
 *
 * @returns {boolean}
 */
export const bookingsOpened = (): boolean => getBookingZoneTime().hour === BOOKING_OPENING_HOUR;
