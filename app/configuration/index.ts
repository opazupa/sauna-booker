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
 * Default sauna preferences
 */
export const DefaultSaunaPreferences: SaunaPreferences = {
  // Only two should be enabled due sauna booking limit per week 2
  // Mon: {
  //   time: 'FIRST',
  //   double: true,
  // },
  // Tue: {
  //   time: 'LAST',
  // },
  // Wed: {
  //   time: 'LAST',
  // },
  Thu: {
    time: 'LAST',
  },
  Fri: {
    time: 'LAST',
  },
  // Sat: {
  //   time: 'MIDDLE',
  // },
  Sun: {
    time: 'LAST',
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
