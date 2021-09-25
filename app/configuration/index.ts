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
} = process.env;
/**
 * Env configuration
 *
 * @interface IConfiguration
 */
export const Configuration: IConfiguration = {
  isDev: () => (APP_ENV as string) === DEVELOPMENT,
  aws: {
    region: AWS_S3_REGION,
  },
  booking: {
    userName: BOOKING_USERNAME,
    password: BOOKING_PASSWORD,
  },
  sentry: {
    dsn: SENTRY_DSN,
    env: (SENTRY_ENV || NODE_ENV) as string,
  },
  chromeExecPath: CHROME_EXEC_PATH,
};
