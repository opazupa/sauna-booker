import { SaunaPreference, WeeklyPreference } from './types';

/**
 * Configured sauna preferences
 */
export const DefaultSaunaPreference: SaunaPreference = {
  // Only two should be enabled due sauna booking limit per week 2
  Thu: { time: 'LAST' },
  Sun: { time: 'LAST' },
};

/**
 * Configured special weekly sauna preferences.
 * Will override {DefaultSaunaPreference}
 */
export const WeeklySaunaPreferences: WeeklyPreference = {
  47: { Sun: { time: 'LAST' } },
  48: { Fri: { double: true, time: 'LAST' } },
  51: { Sun: { time: 'LAST' } },
  52: { Thu: { time: 'MIDDLE' } },
  1: { Sat: { time: 'MIDDLE' } },
  2: { Thu: { time: 'LAST' }, Sat: { time: 'MIDDLE' } },
  3: { Sat: { time: 'MIDDLE' }, Sun: { time: 'LAST' } },
};
