import { Page } from 'puppeteer-core';

import { Configuration } from '../configuration';
import { repeatClick, shortPause } from '../utils';

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

export const bookSaunaSlot = async (page: Page) => {
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

  // Now for testing let's use pyykkitupa
  // TODO removed
  await page.waitForSelector('select[name=calendar]').then((dropdown) => dropdown.select('2530'));

  // Browse 4 weeks ahead (calendar is open)
  await repeatClick(page, PAGE.NEXT_WEEK_BUTTON, 4);

  // TODO add more custom logic
  // Now the func is run on midnight on fri & sun to book last slots to sauna.
  const currentDate = await page.$eval(PAGE.SELECTED_DATE, (el) => el.textContent);
  const freeSlots = await page.$$(PAGE.FREE_SLOT);
  console.log(`Found ${freeSlots.length} free slots ready to be booked`);
  const lastFreeSlot = freeSlots[freeSlots.length - 1];
  const text = await page.evaluate((lastFreeSlot) => <string>lastFreeSlot.textContent, lastFreeSlot);
  await lastFreeSlot.click();
  await page.click(PAGE.CONFIRM_BUTTON);
  console.log(`Booked slot ${text.replace('vapaa', '')} on ${currentDate.split('(', 1)}`);

  // Wait until request is done
  await shortPause(page);
};
