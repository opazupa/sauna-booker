import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const { timezone } = Configuration.booking;

export const BOOKING_WEEKS_AHEAD = 4;

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
