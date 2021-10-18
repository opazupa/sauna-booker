// Weekday
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
// Sauna time preference
export type TimePreference = 'FIRST' | 'MIDDLE' | 'LAST';

/**
 * Sauna day
 */
export type SaunaDay = {
  // Time of day
  time: TimePreference;
  // Two bookings on same day
  double?: boolean;
};
/**
 * Sauna preferences
 */
export type SaunaPreferences = {
  [key in Weekday]?: SaunaDay;
};

/**
 * Configured sauna preferences
 */
export const ConfiguredSaunaPreferences: SaunaPreferences = {
  // Only two should be enabled due sauna booking limit per week 2
  Mon: {
    time: 'FIRST',
    // double: true,
  },
  Tue: {
    time: 'LAST',
  },
  Wed: {
    time: 'LAST',
  },
  Thu: {
    time: 'LAST',
  },
  Fri: {
    time: 'LAST',
  },
  Sat: {
    time: 'MIDDLE',
  },
  Sun: {
    time: 'LAST',
  },
};
