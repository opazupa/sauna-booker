// Weekday
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
// Sauna time preference
export type TimePreference = 'FIRST' | 'MIDDLE' | 'SECOND_LAST' | 'LAST';

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
export type SaunaPreference = {
  [key in Weekday]?: SaunaDay;
};

/**
 * Weekly sauna preferences
 */
export type WeeklyPreference = {
  [key: number]: SaunaPreference;
};
