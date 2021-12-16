import { Handler } from 'aws-lambda';

import { hasSaunaPreference } from './configuration';
import { Weekday } from './configuration/types';
import { bookSaunaSlots, getSaunaUsage } from './services/booking';
import { createInvite } from './services/calendar';
import { saveErrorScreenShot, saveSaunaLog } from './services/s3';
import { sendNotification } from './services/telegram';
import { bookingsOpened, getBookingSlotDate, getBookingZoneTime, setup, wrapHandler } from './utils';

/**
 * Book sauna event parameters
 */
type BookSaunaParams = {
  ignoreOpeningHour: boolean;
};

/**
 * Book sauna by the configuration
 */
export const bookSauna: Handler<BookSaunaParams> = wrapHandler(async (event, context) => {
  const today = getBookingZoneTime();
  const bookingDate = getBookingSlotDate();
  const saunaDayPreference = hasSaunaPreference(bookingDate);

  // Return if the trigger is not on the booking opening hour
  if (!(event.ignoreOpeningHour || bookingsOpened())) {
    console.log(`No opening hour, no trigger. The time in booking timezone is ${today.toString()} 🤔`);
    return;
  }

  // Check if the day is configured
  if (!saunaDayPreference) {
    console.log(`No sauna preferences configured for ${bookingDate.weekdayShort} on week ${bookingDate.weekNumber}`);
    return;
  }
  console.log(`Found sauna preference for ${bookingDate.weekdayShort} : ${JSON.stringify(saunaDayPreference)}`);

  const { browser, page } = await setup();
  try {
    const bookings = await bookSaunaSlots({ page, bookingDate, saunaDayPreference });
    for (const booking of bookings) {
      console.log(booking);
      await sendNotification(booking.status);
      if (!booking.error) await createInvite({ ...booking });
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

/**
 * Log sauna usage for today
 */
export const logSaunaUsage: Handler = wrapHandler(async () => {
  const today = getBookingZoneTime();
  console.log(`Logging sauna usage for ${today.weekdayShort} on week ${today.weekNumber}`);

  const { browser, page } = await setup();
  try {
    const stats = await getSaunaUsage(page, <Weekday>today.weekdayShort);
    await saveSaunaLog(stats, today);
    await browser.close();
  } catch (err) {
    await browser.close();
    throw err;
  }
});
