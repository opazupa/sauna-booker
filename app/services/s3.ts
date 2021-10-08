import AWS from 'aws-sdk';
import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const { aws, isDev } = Configuration;

// Create S3 service object
const s3 = new AWS.S3({
  region: aws.region,
  endpoint: `${aws.url}${isDev() ? `/${aws.bucket}` : ''}`, // Minion dev requirement
  accessKeyId: aws.accessKey,
  secretAccessKey: aws.accessSecret,
  s3BucketEndpoint: true,
});

/**
 * Save screenshot to error bucket
 *
 * @param {Buffer} screenShot
 * @param {string} requestId
 * @param {DateTime} dateInfo
 */
export const saveErrorScreenShot = async (screenShot: Buffer, requestId: string, dateInfo: DateTime) => {
  const fileName = `${dateInfo.toLocaleString()}/${requestId}.png`;

  // Upload parameterss
  const params = {
    Bucket: aws.bucket,
    Key: fileName,
    Body: screenShot,
  } as AWS.S3.PutObjectRequest;

  // Upload file to the bucket
  await s3
    .putObject(params)
    .promise()
    .then(() => console.log(`Uploaded error screenshot ${fileName} to ${aws.bucket} 🚀`));
};
