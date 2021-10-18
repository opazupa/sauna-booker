import { Handler } from 'aws-lambda';

import { bookSaunaSlots } from './services/booking';
import { createInvite } from './services/calendar';
import { sendNotification } from './services/telegram';
import { bookingsOpened, getBookingZoneTime, hasSaunaPreference, setup, wrapHandler } from './utils';

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
  // Return if the trigger is not on the booking opening hour
  if (!(event.ignoreOpeningHour || bookingsOpened())) {
    console.log(`No opening hour, no trigger. The time in booking timezone is ${today.toString()} 🤔`);
    return;
  }

  // Check if the day is configured
  if (!hasSaunaPreference()) {
    console.log(`No sauna preferences configured for ${today.weekdayShort}`);
    return;
  }

  const { browser, page } = await setup();

  try {
    const bookings = await bookSaunaSlots(page);
    for (const booking of bookings) {
      console.log(booking.status);
      await sendNotification(booking.status);
      if (!booking.error) createInvite({ ...booking });
    }
    await browser.close();
  } catch (err) {
    await browser.close();
    throw err;
  }
});
