import * as dotenv from 'dotenv';

const DEVELOPMENT = 'dev';

// Weekday
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
// Sauna time preference
export type TimePreference = 'FIRST' | 'MIDDLE' | 'LAST';

/**
 * Sauna day
 */
export type SaunaDay = {
  time: TimePreference;
};
/**
 * Sauna preferences
 */
export type SaunaPreferences = {
  [key in Weekday]?: SaunaDay;
};

/**
 * Default sauna preferences
 */
export const DefaultSaunaPreferences: SaunaPreferences = {
  // Only two should be enabled due sauna booking limit per week 2
  Mon: {
    time: 'MIDDLE',
  },
  Tue: {
    time: 'LAST',
  },
  Wed: {
    time: 'LAST',
  },
  Thu: {
    time: 'FIRST',
  },
  Fri: {
    time: 'LAST',
  },
  Sat: {
    time: 'MIDDLE',
  },
  Sun: {
    time: 'MIDDLE',
  },
};

/**
 * Env configuration interface
 *
 * @interface IConfiguration
 */
export interface IConfiguration {
  isDev: () => boolean;
  aws: {
    region: string;
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
    region: AWS_S3_REGION,
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
