import { Page } from 'puppeteer-core';

import { Configuration } from '../configuration';
import { getBookingSlotDate, repeatClick, shortPause } from '../utils';

// Site home URL
const HOME_URL = 'https://plus.yitgroup.com';

/**
 * HTML DOM selectors for components
 */
const PAGE = {
  USER_INPUT: '#signInName',
  PASSWORD_INPUT: '#password',
  LOGIN_BUTTON: '#next',
  CONFIRM_BUTTON: '.ok',
  NEW_BOOKING_BUTTON: '.addbooking',
  ACCEPT_COOKIES_BUTTON: 'button[data-allowall]',
  FREE_SLOT: 'div.slot[data-bookedby=none]',
  MY_BOOKED_SLOT: 'div.slot[data-bookedby=self]',
  NEXT_WEEK_BUTTON: '.next.browse',
  SELECTED_DATE: '.activedate',
  SELECT_DAY_BADGE: 'dayball',
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
 * @returns
 */
export const bookSaunaSlot = async (page: Page) => {
  // Go to home site
  await page.goto(HOME_URL);
  await login(page);
  // Wait for page to render after redirect
  await shortPause(page);
  await navigateToBookings(page);
  // TODO remove after testing
  await page.waitForSelector('select[name=calendar]').then((dropdown) => dropdown.select('2530'));
  const { status } = await bookFreeSlot(page);

  return status;
};

/**
 * Create info about the booking
 *
 * @param {string} selectedSlot
 * @returns {SaunaBooking}
 */
const createBookingInfo = (selectedSlot: string): SaunaBooking => {
  const saunaDate = getBookingSlotDate().set({ second: 0, minute: 0 });
  const startHour = parseInt(selectedSlot.substring(0, 2));
  return {
    title: 'Saunavuoro',
    location: 'Harjus kattosauna',
    starts: saunaDate.set({ hour: startHour }).toString(),
    ends: saunaDate.set({ hour: startHour + 1 }).toString(),
    timezone: Configuration.booking.timezone,
  } as SaunaBooking;
};

/**
 * Book a sauna slot based on configuration
 *
 * @param {Page} page
 * @returns {Promise<{ status: string; info: SaunaBooking }>}
 */
const bookFreeSlot = async (page: Page): Promise<{ status: string; info: SaunaBooking }> => {
  // Browse 4 weeks ahead (calendar is bookable 4 weeks from now)
  await repeatClick(page, PAGE.NEXT_WEEK_BUTTON, 4);

  // Log info on which date was selected by default
  const selectedDate = await page.$eval(PAGE.SELECTED_DATE, (el) => el.textContent);
  console.log(`${selectedDate}is selected by default from the calendar.`);

  // Reselect the day if needed (4 weeks from now)
  await page
    .$x(`//div[contains(@class, ${PAGE.SELECT_DAY_BADGE})][text()="${getBookingSlotDate().day}"]`)
    .then(async ([button]) => await button.click());

  // TODO add more custom logic
  // Now the func is run on midnight to book last slots to sauna.
  const freeSlots = await page.$$(PAGE.FREE_SLOT);
  console.log(`Found ${freeSlots.length} free slots ready to be booked`);

  // Stop the process if not free slots are there
  if (freeSlots.length === 0) throw Error('No slots available 😓');

  const selectedSlot = freeSlots[freeSlots.length - 1];
  const selectedSlotText = await page.evaluate((selectedSlot) => <string>selectedSlot.textContent, selectedSlot);
  await selectedSlot.click().then(() => console.log(`Clicked on ${selectedSlotText} slot tile.`));

  await page
    .waitForSelector(PAGE.CONFIRM_BUTTON, { visible: true })
    .then((okButton) => okButton.click().then(() => console.log('Clicked on confirm booking.')));
  let status = `Booked sauna slot for you sir! 🙏 It is at ${selectedSlotText.replace(
    'vapaa',
    '',
  )} on ${getBookingSlotDate().toFormat(`ccc d'.' LLLL`)}. 👌👌`;

  // Check that there is a slot booked for us.
  console.log('Waiting to verify booking confirmation.');
  await page.waitForSelector(PAGE.MY_BOOKED_SLOT);
  const mySlots = await page.$$(PAGE.MY_BOOKED_SLOT);

  if (mySlots.length === 0) status = 'Failed to verify booking 😓';
  console.log(status);

  return { status, info: createBookingInfo(selectedSlotText) };
};

/**
 * Handle login to site
 *
 * @param {Page} page
 */
const login = async (page: Page) => {
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
};

/**
 * Navigate to booking tab
 *
 * @param {Page} page
 */
const navigateToBookings = async (page: Page) => {
  // Accept cookies
  await page
    .waitForSelector(PAGE.ACCEPT_COOKIES_BUTTON, { visible: true })
    .then((cookieButton) => cookieButton.click());

  // Wait for page to render
  await shortPause(page);
  await page.goto(`${HOME_URL}/book-common-spaces`);

  // Navigate to bookings
  await page.waitForSelector(PAGE.NEW_BOOKING_BUTTON, { visible: true }).then((button) => button.click());
};
