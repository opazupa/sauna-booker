import chrome from 'chrome-aws-lambda';
import puppeteer, { Browser, Page } from 'puppeteer-core';

import { Configuration } from '../configuration';

const { isDev, chromeExecPath, booking } = Configuration;

/**
 * Setup puppeteer browser and page
 *
 * @returns {Promise<{ browser: Browser; page: Page }>}
 */
export const setup = async (): Promise<{ browser: Browser; page: Page }> => {
  const devEnv = isDev();
  const browser = await puppeteer.launch({
    executablePath: devEnv ? chromeExecPath : await chrome.executablePath,
    args: devEnv ? ['--no-sandboxs'] : chrome.args,
    devtools: devEnv,
    headless: !devEnv,
    defaultViewport: null,
    slowMo: devEnv ? 250 : null,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.emulateTimezone(booking.timezone);

  return { browser, page };
};

/**
 * Keep short pause while executing
 *
 * @param {Page} page
 */
export const shortPause = async (page: Page) => {
  const pauseTime = 5000;
  await page.waitForTimeout(pauseTime);
};

/**
 * Handle repeat click
 *
 * @param {Page} page
 * @param {string} selector
 * @param {number} times
 */
export const repeatClick = async (page: Page, selector: string, times: number) => {
  for (let i = 0; i < times; i++) {
    await page.waitForTimeout(500);
    await page.click(selector).then(() => console.log(`Clicked ${selector} on repeat ${i + 1}/${times}`));
  }
};
