import * as dotenv from 'dotenv';
import { DateTime } from 'luxon';

import { DefaultSaunaPreference, WeeklySaunaPreferences } from './preference';
import { SaunaDay, SaunaPreference, WeeklyPreference } from './types';

export { SaunaDay } from './types';

const DEVELOPMENT = 'dev';
const WEEKLY_BOOKING_LIMIT = 2;

/**
 * Env configuration interface
 *
 * @interface IConfiguration
 */
export interface IConfiguration {
  isDev: () => boolean;
  aws: {
    region: string;
    url: string;
    accessKey: string;
    accessSecret: string;
    bucket: string;
  };
  booking: {
    site: string;
    userName: string;
    password: string;
    timezone: string;
    defaultPreference: SaunaPreference;
    weeklyPreferences: WeeklyPreference;
  };
  google: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    attendees: string[];
  };
  sentry: {
    dsn: string;
    env: string;
  };
  telegram: {
    chatId: string;
    botToken: string;
  };
  chromeExecPath?: string;
}

// Apply .env
dotenv.config();

const {
  APP_ENV,
  AWS_S3_REGION,
  AWS_S3_BUCKET,
  AWS_S3_URL,
  AWS_S3_ACCESS_KEY,
  AWS_S3_ACCESS_SECRET,
  GOOGLE_CALENDAR_CLIENT_ID,
  GOOGLE_CALENDAR_CLIENT_SECRET,
  GOOGLE_CALENDAR_REFRESH_TOKEN,
  GOOGLE_CALENDAR_ATTENDEES,
  SENTRY_DSN,
  SENTRY_ENV,
  NODE_ENV,
  CHROME_EXEC_PATH,
  BOOKING_USERNAME,
  BOOKING_PASSWORD,
  BOOKING_TIMEZONE,
  TELEGRAM_CHAT_ID,
  TELEGRAM_BOT_TOKEN,
} = process.env;

/**
 * Env configuration
 *
 * @interface IConfiguration
 */
export const Configuration: IConfiguration = {
  isDev: () => APP_ENV === DEVELOPMENT,
  aws: {
    url: AWS_S3_URL,
    region: AWS_S3_REGION,
    accessKey: AWS_S3_ACCESS_KEY,
    accessSecret: AWS_S3_ACCESS_SECRET,
    bucket: AWS_S3_BUCKET,
  },
  booking: {
    site: 'https://plus.yitgroup.com',
    userName: BOOKING_USERNAME,
    password: BOOKING_PASSWORD,
    timezone: BOOKING_TIMEZONE,
    defaultPreference: DefaultSaunaPreference,
    weeklyPreferences: WeeklySaunaPreferences,
  },
  google: {
    clientId: GOOGLE_CALENDAR_CLIENT_ID,
    clientSecret: GOOGLE_CALENDAR_CLIENT_SECRET,
    refreshToken: GOOGLE_CALENDAR_REFRESH_TOKEN,
    attendees: GOOGLE_CALENDAR_ATTENDEES.split(','),
  },
  sentry: {
    dsn: SENTRY_DSN,
    env: SENTRY_ENV || NODE_ENV,
  },
  telegram: {
    botToken: TELEGRAM_BOT_TOKEN,
    chatId: TELEGRAM_CHAT_ID,
  },
  chromeExecPath: CHROME_EXEC_PATH,
};

/**
 * Get sauna preference for the booking day
 *
 * @returns
 */
export const hasSaunaPreference = (date: DateTime): SaunaDay | null => {
  const { defaultPreference, weeklyPreferences } = Configuration.booking;

  // Take special preference if found for the week
  const preference = weeklyPreferences[date.weekNumber] || defaultPreference;

  // Validate sauna configuration for debugging
  const configuredBookingCount = Object.values(preference).reduce((a, b) => (b.double ? a + 2 : ++a), 0);
  if (configuredBookingCount > WEEKLY_BOOKING_LIMIT) {
    console.warn(`Weekly booking limit ${WEEKLY_BOOKING_LIMIT} exceeded with ${configuredBookingCount}.`);
  }
  return preference[date.weekdayShort];
};
