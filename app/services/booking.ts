import { Page } from 'puppeteer-core';

import { Configuration } from '../configuration';
import { getBookingZoneTime, repeatClick, shortPause } from '../utils';

const HOME_URL = 'https://plus.yitgroup.com';

const PAGE = {
  USER_INPUT: '#signInName',
  PASSWORD_INPUT: '#password',
  LOGIN_BUTTON: '#next',
  CONFIRM_BUTTON: '.ok',
  NEW_BOOKING_BUTTON: '.addbooking',
  ACCEPT_COOKIES_BUTTON: 'button[data-allowall]',
  FREE_SLOT: 'div.slot[data-bookedby=none]',
  NEXT_WEEK_BUTTON: '.next.browse',
  SELECTED_DATE: '.activedate',
};

/**
 * Sauna booking
 *
 * @interface SaunaBooking
 */
interface SaunaBooking {
  title: string;
  location: string;
  starts: string;
  ends: string;
  timezone: string;
}

/**
 * Book a sauna slot
 *
 * @param {Page} page
 * @returns {Promise<SaunaBooking>}
 */
export const bookSaunaSlot = async (page: Page): Promise<SaunaBooking> => {
  // Go to booking site
  await page.goto(HOME_URL);

  // After redirection submit login creds
  await page.waitForSelector(PAGE.USER_INPUT);
  await page.$eval(
    PAGE.USER_INPUT,
    (el, userName: string) => ((<HTMLInputElement>el).value = userName),
    Configuration.booking.userName,
  );
  await page.$eval(
    PAGE.PASSWORD_INPUT,
    (el, password: string) => ((<HTMLInputElement>el).value = password),
    Configuration.booking.password,
  );
  await page.click(PAGE.LOGIN_BUTTON);

  // Accept cookies
  await page
    .waitForSelector(PAGE.ACCEPT_COOKIES_BUTTON, { visible: true })
    .then((cookieButton) => cookieButton.click());

  // Wait for page to render
  await shortPause(page);
  await page.goto(`${HOME_URL}/book-common-spaces`);

  // Navigate to bookings
  await page.waitForSelector(PAGE.NEW_BOOKING_BUTTON, { visible: true }).then((button) => button.click());

  // Browse 4 weeks ahead (calendar is bookable 4 weeks from nows)
  await repeatClick(page, PAGE.NEXT_WEEK_BUTTON, 4);

  // TODO add more custom logic
  // Now the func is run on midnight on fri & sun to book last slots to sauna.
  const currentDate = await page.$eval(PAGE.SELECTED_DATE, (el) => el.textContent);
  const freeSlots = await page.$$(PAGE.FREE_SLOT);
  console.log(`Found ${freeSlots.length} free slots ready to be booked`);

  // Stop the process if not free slots are there
  if (freeSlots.length === 0) {
    console.log('No slots available :(');
    return;
  }

  const selectedSlot = freeSlots[freeSlots.length - 1];
  const selectedSlotText = await page.evaluate((selectedSlot) => <string>selectedSlot.textContent, selectedSlot);
  await selectedSlot.click();

  await page.click(PAGE.CONFIRM_BUTTON);
  console.log(`Booked slot ${selectedSlotText.replace('vapaa', '')} on ${currentDate.split('(', 1)}`);

  // Wait until request is done
  await shortPause(page);

  return createBookingInfo(selectedSlotText);
};

/**
 * Create info about the booking
 *
 * @param {string} selectedSlot
 * @returns {SaunaBooking}
 */
const createBookingInfo = (selectedSlot: string): SaunaBooking => {
  const saunaDate = getBookingZoneTime().plus({ weeks: 4 }).set({ second: 0, minute: 0 });
  const startHour = parseInt(selectedSlot.substring(0, 2));
  return {
    title: 'Saunavuoro',
    location: 'Harjus kattosauna',
    starts: saunaDate.set({ hour: startHour }).toString(),
    ends: saunaDate.set({ hour: startHour + 1 }).toString(),
    timezone: Configuration.booking.timezone,
  } as SaunaBooking;
};
