import { DateTime } from 'luxon';
import { ElementHandle, Page } from 'puppeteer-core';

import { Configuration, SaunaDay } from '../configuration';
import { BOOKING_WEEKS_AHEAD, getBookingSlotDate, repeatClick, shortPause } from '../utils';

// Site home URL
const HOME_URL = Configuration.booking.site;
const DOUBLE_BOOK = true;

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
  SLOTS_XP: '//div[@class = "slot"]',
  FREE_SLOT: 'div.slot[data-bookedby=none]',
  MY_BOOKED_SLOT_XP: '//div[contains(@class, "slot")][@data-bookedby="self"]',
  NEXT_WEEK_BUTTON: '.next.browse',
  SELECTED_DATE: '.activedate',
  SELECT_DAY_BADGE: 'dayball',
};

/**
 * Sauna booking
 */
export type SaunaBooking = {
  end?: DateTime;
  start?: DateTime;
  timeZone?: string;
  error?: boolean;
  status: string;
};

/**
 * Sauna slot booking params
 */
type SaunaSlotBookingParams = {
  page: Page;
  bookingDate: DateTime;
  saunaDayPreference: SaunaDay;
};

/**
 * Book sauna slots
 *
 * @returns
 */
export const bookSaunaSlots = async (params: SaunaSlotBookingParams) => {
  const { page } = params;
  await page.goto(HOME_URL);
  await login(page);
  await navigateToBookings(page);
  return await bookFreeSlots(params);
};

/**
 * Book sauna slot(s) based on configuration
 *
 * @param {Page} page
 * @returns {Promise<SaunaBooking[]>}
 */
const bookFreeSlots = async ({
  page,
  bookingDate,
  saunaDayPreference,
}: SaunaSlotBookingParams): Promise<SaunaBooking[]> => {
  // Browse 4 weeks ahead (calendar is bookable 4 weeks from now)
  await repeatClick(page, PAGE.NEXT_WEEK_BUTTON, BOOKING_WEEKS_AHEAD);

  // Reselect the day and handle sunday/monday
  await page
    .$x(`//div[contains(@class, ${PAGE.SELECT_DAY_BADGE})][text()="${bookingDate.day}"]`)
    .then(async ([button]) => {
      await page
        .$eval(PAGE.SELECTED_DATE, (el) => el.textContent)
        // Log info on which date was selected by default
        .then((text) => console.log(`${text}is selected by default from the calendar.`));

      if (button) await button.click().then(() => console.log(`Reclicked the button for day ${bookingDate.day}`));
      // It's monday, and the date is actually on the next week. Select monday as well.
      else {
        await page.click(PAGE.NEXT_WEEK_BUTTON).then(() => console.log(`It's monday, moved to next week instead.`));
        await page.$$(`.${PAGE.SELECT_DAY_BADGE}`).then(async ([monday]) => await monday.click());
      }
    });
  await page
    .$eval(PAGE.SELECTED_DATE, (el) => el.textContent)
    .then((text) => console.log(`${text}is selected finally from the calendar.`));
  const bookings = [];
  bookings.push(await bookNextSlot(page, saunaDayPreference));
  if (saunaDayPreference.double) {
    console.log('Double preference selected for the day. Continueing to second booking');
    await bookNextSlot(page, saunaDayPreference, DOUBLE_BOOK)
      .then((status) => bookings.push(status))
      .catch((err) => {
        // Don't rethrow err due we want to retun at least the one status
        console.log('Something went wrong on the second booking :8!');
        console.error(err);
      });
  }

  return bookings;
};

/**
 * Book next slot by preferences
 *
 * @param {Page} page
 * @param {SaunaDay} preference
 * @param {boolean} [double=false]
 * @returns {Promise<SaunaBooking>}
 */
const bookNextSlot = async (page: Page, preference: SaunaDay, double = false): Promise<SaunaBooking> => {
  const freeSlots = await page
    .waitForXPath(`${PAGE.SLOTS_XP}`, { visible: true })
    .then(async () => await page.$$(PAGE.FREE_SLOT));
  console.log(`Found ${freeSlots.length} free slots ready to be booked`);

  // Stop the process if not free slots are there
  if (freeSlots.length === 0) {
    if (!double) throw Error('No slots available 😓');
    else return { error: true, status: `Failed to book double on ${getBookingSlotDate().toFormat(`ccc d'.' LLLL`)}` };
  }

  const selectedSlot = selectPreferredSaunaSlot(freeSlots, preference);
  const selectedSlotText = await page.evaluate((selectedSlot) => <string>selectedSlot.textContent, selectedSlot);
  await selectedSlot.click().then(() => console.log(`Clicked on ${selectedSlotText} slot tile.`));

  await page
    .waitForSelector(PAGE.CONFIRM_BUTTON, { visible: true })
    .then((okButton) => okButton.click().then(() => console.log('Clicked on confirm booking.')));

  // Check that there is a slot booked for us.
  console.log(`Waiting to verify booking (${double ? 2 : 1}) confirmation.`);
  // Force short break
  const mySlotsConfirmed = await page.waitForXPath(`${PAGE.MY_BOOKED_SLOT_XP}[${double ? 2 : 1}]`);

  if (mySlotsConfirmed) console.log(`Verify booking (${double ? 2 : 1}) confirmation.`);
  else return { error: true, status: 'Failed to verify the new booking 😓' };

  // Formatted like 19.00-20.00...
  const startHour = parseInt(selectedSlotText.substring(0, 2));
  return {
    status: `Booked sauna slot for you sir! 🙏 It is at ${selectedSlotText.replace(
      'vapaa',
      '',
    )} on ${getBookingSlotDate().toFormat(`ccc d'.' LLLL`)}. 👌👌`,
    start: getBookingSlotDate().set({ hour: startHour }),
    end: getBookingSlotDate().set({ hour: startHour + 1 }),
    timeZone: Configuration.booking.timezone,
    error: false,
  } as SaunaBooking;
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
  console.log('Login successful.');
  // Wait for page to render after login redirect
  await shortPause(page);
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
  await page.goto(`${HOME_URL}/book-common-spaces`).then(() => console.log('Navigated to bookings'));

  // Navigate to bookings
  await page
    .waitForSelector(PAGE.NEW_BOOKING_BUTTON, { visible: true })
    .then((button) => button.click())
    .then(() => console.log('Booking calendar visible. Ready to start booking.'));
};

/**
 * Select free sauna slot from available ones based on preference
 *
 * @param {ElementHandle<Element>[]} slots
 * @returns {ElementHandle<Element>}
 */
const selectPreferredSaunaSlot = (slots: ElementHandle<Element>[], preference: SaunaDay): ElementHandle<Element> => {
  switch (preference.time) {
    case 'FIRST':
      return slots[0];
    case 'MIDDLE':
      return slots[Math.round((slots.length - 1) / 2)];
    case 'LAST':
      return slots[slots.length - 1];
    default:
      throw Error(`Unknown sauna day preference: ${preference.time}`);
  }
};
