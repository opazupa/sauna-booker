import { Page } from 'puppeteer-core';

import { Configuration } from '../configuration';

export const bookSlot = async (page: Page) => {
  await page.goto('https://plus.yitgroup.com/');

  await page.waitForSelector('#signInName');
  await page.$eval('#signInName', (el) => ((<HTMLInputElement>el).value = Configuration.booking.userName));
  await page.$eval('#password', (el) => ((<HTMLInputElement>el).value = Configuration.booking.password));
  await page.click('#next');

  await page.waitForSelector('button[data-allowall]', { visible: true });
  await page.click('button[data-allowall]');
  await page.waitForTimeout(5000);

  await page.goto('https://plus.yitgroup.com/book-common-spaces');
  await page.waitForSelector('.addbooking', { visible: true });
  await page.click('.addbooking');
  await page.waitForSelector('select[name=calendar]');
  await page.select('select[name=calendar]', '2530');

  //
  for (let index = 0; index <= 3; index++) {
    await page.click('.next.browse');
  }

  let freeSlots = await page.$$('div.slot[data-bookedby=none]');
  console.log(freeSlots.length);
  await freeSlots[0].click();
  await page.click('.ok');
  await page.waitForTimeout(5000);

  freeSlots = await page.$$('div.slot[data-bookedby=none]');
  console.log(freeSlots.length);
  await freeSlots[freeSlots.length - 1].click();
  await page.click('.ok');
};
