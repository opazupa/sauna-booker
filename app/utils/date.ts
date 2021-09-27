import { DateTime } from 'luxon';

import { Configuration, SaunaDay } from '../configuration';

const { timezone, saunaDayPreferences } = Configuration.booking;

export const BOOKING_WEEKS_AHEAD = 4;
const WEEKLY_BOOKING_LIMIT = 2;

/**
 * Check if sauna preference is configured for today
 *
 * @returns
 */
export const hasSaunaPreference = (): SaunaDay | null => {
  // Validate sauna configuration for debugging
  const dayConfigKeys = Object.keys(saunaDayPreferences);
  if (dayConfigKeys.length > WEEKLY_BOOKING_LIMIT) {
    console.warn(`Weekly booking limit ${WEEKLY_BOOKING_LIMIT} exceeded with ${dayConfigKeys.join(',')} enabled.`);
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
 * Is it midnight in the booking time zone
 *
 * @returns {boolean}
 */
export const isMidnight = (): boolean => getBookingZoneTime().hour === 0;
