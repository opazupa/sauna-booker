import * as dotenv from 'dotenv';

const DEVELOPMENT = 'dev';

/**
 * Env configuration interface
 *
 * @interface IConfiguration
 */
interface IConfiguration {
  isDev: () => boolean;
  aws: {
    region: string;
  };
  sentry: {
    dsn: string;
    env: string;
  };
}

// Apply .env
dotenv.config();

/**
 * Env configuration
 *
 * @interface IConfiguration
 */
export const Configuration: IConfiguration = {
  isDev: () => (process.env.APP_ENV as string) === DEVELOPMENT,
  aws: {
    region: process.env.AWS_S3_REGION as string,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN as string,
    env: (process.env.SENTRY_ENV || process.env.NODE_ENV) as string,
  },
};
