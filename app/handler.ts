import { Handler } from 'aws-lambda';

import { Configuration } from './configuration';
import { bookSaunaSlot } from './services/booking';
import { sendNotification } from './services/telegram';
import { getBookingZoneTime, isMidnight, setup, wrapHandler } from './utils';

/**
 * Book sauna by the configuration
 */
export const bookSauna: Handler = wrapHandler(async () => {
  // Return if the trigger is not on the midnight
  if (!isMidnight()) {
    console.log(`No midnight, no trigger. The time in booking timezone is ${getBookingZoneTime().toString()} 🤔`);
    return;
  }
  const { browser, page } = await setup(Configuration);

  try {
    const { status } = await bookSaunaSlot(page);
    await sendNotification(status);
    browser.close();
  } catch (err) {
    browser.close();
    throw err;
  }
});
