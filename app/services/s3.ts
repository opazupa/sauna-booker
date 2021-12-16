import S3, { PutObjectRequest } from 'aws-sdk/clients/s3';
import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const { aws, isDev } = Configuration;

const LOG_FILE_NAME = 'sauna-log.csv';

// Create S3 service object
const s3 = new S3({
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
  const fileName = `${dateInfo.toFormat('yyyy/MM/dd')}/${requestId}_${dateInfo.minute}.png`;

  // Upload parameterss
  const params = {
    Bucket: aws.bucket,
    Key: fileName,
    Body: screenShot,
  } as PutObjectRequest;

  // Upload file to the bucket
  await s3
    .putObject(params)
    .promise()
    .then(() => console.log(`Uploaded error screenshot ${fileName} to ${aws.bucket} 🚀`));
};

/**
 * Save sauna log
 *
 * @param {{ all: number; free: number }} stats
 * @param {DateTime} dateInfo
 * @returns
 */
export const saveSaunaLog = async (stats: { all: number; free: number }, dateInfo: DateTime) => {
  const newEntry = `${dateInfo.toFormat('yyyy/MM/dd')};${stats.all};${stats.free}`;
  // Get the current
  const data = await s3
    .getObject({
      Bucket: aws.bucket,
      Key: LOG_FILE_NAME,
    })
    .promise()
    .then((res) => res.Body.toString());

  if (!data) return;

  // Add the new entry and save
  await s3
    .putObject({
      Bucket: aws.bucket,
      Key: LOG_FILE_NAME,
      Body: data + '\n' + newEntry,
    })
    .promise()
    .then(() => console.log(`Updated ${LOG_FILE_NAME} with entry ${newEntry} to ${aws.bucket} 🚀`));
};
