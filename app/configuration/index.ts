import * as dotenv from 'dotenv';

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
  };
  booking: {
    userName: string;
    password: string;
    timezone: string;
  };
  sentry: {
    dsn: string;
    env: string;
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
  },
  sentry: {
    dsn: SENTRY_DSN,
    env: SENTRY_ENV || NODE_ENV,
  },
  chromeExecPath: CHROME_EXEC_PATH,
};
