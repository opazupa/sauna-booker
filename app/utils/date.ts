import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const { timezone } = Configuration.booking;

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
 * Is it midnight in the booking time zone
 *
 * @returns {boolean}
 */
export const isMidnight = (): boolean => getBookingZoneTime().hour === 0;
