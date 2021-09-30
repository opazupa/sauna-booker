import { Handler } from 'aws-lambda';

import { Configuration } from './configuration';
import { bookSaunaSlot } from './services/booking';
import { saveErrorScreenShot } from './services/s3';
import { sendNotification } from './services/telegram';
import { getBookingZoneTime, hasSaunaPreference, isMidnight, setup, wrapHandler } from './utils';

/**
 * Book sauna event parameters
 */
type BookSaunaParams = {
  ignoreMidnight: boolean;
};

/**
 * Book sauna by the configuration
 */
export const bookSauna: Handler<BookSaunaParams> = wrapHandler(async (event, context) => {
  const today = getBookingZoneTime();
  // Return if the trigger is not on the midnight
  if (!(event.ignoreMidnight || isMidnight())) {
    console.log(`No midnight, no trigger. The time in booking timezone is ${today.toString()} 🤔`);
    return;
  }

  // Check if the day is configured
  if (!hasSaunaPreference()) {
    console.log(`No sauna preferences configured for ${today.weekdayShort}`);
    return;
  }

  const { browser, page } = await setup(Configuration);

  try {
    const statuses = await bookSaunaSlot(page);
    for (const status of statuses) {
      console.log(status);
      await sendNotification(status);
    }
    await browser.close();
  } catch (err) {
    await page
      .screenshot({ fullPage: true })
      .then(async (screenShot) => await saveErrorScreenShot(<Buffer>screenShot, context.awsRequestId, today))
      .catch((err) => console.error(err));
    await browser.close();
    throw err;
  }
});
