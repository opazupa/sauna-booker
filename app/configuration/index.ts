import * as dotenv from 'dotenv';

import { DefaultSaunaPreferences, SaunaPreferences } from './sauna-preference';

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
    userName: string;
    password: string;
    timezone: string;
    saunaDayPreferences: SaunaPreferences;
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
    userName: BOOKING_USERNAME,
    password: BOOKING_PASSWORD,
    timezone: BOOKING_TIMEZONE,
    saunaDayPreferences: DefaultSaunaPreferences,
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
