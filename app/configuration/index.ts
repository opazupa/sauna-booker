import * as dotenv from 'dotenv';

import { ConfiguredSaunaPreferences, SaunaPreferences } from './sauna-preference';

export { SaunaDay } from './sauna-preference';

const DEVELOPMENT = 'dev';

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
    saunaDayPreferences: SaunaPreferences;
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
    saunaDayPreferences: ConfiguredSaunaPreferences,
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
