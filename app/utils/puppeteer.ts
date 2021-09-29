import chrome from 'chrome-aws-lambda';
import puppeteer, { Browser, Page } from 'puppeteer-core';

import { IConfiguration } from '../configuration';

/**
 * Setup puppeteer browser and page
 *
 * @param {IConfiguration} config
 * @returns {Promise<{ browser: Browser; page: Page }>}
 */
export const setup = async (config: IConfiguration): Promise<{ browser: Browser; page: Page }> => {
  const browser = await puppeteer.launch({
    executablePath: config.isDev() ? config.chromeExecPath : await chrome.executablePath,
    args: config.isDev() ? ['--no-sandboxs'] : chrome.args,
    devtools: config.isDev(),
    headless: !config.isDev(),
    defaultViewport: null,
    slowMo: config.isDev() ? 250 : null,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.emulateTimezone(config.booking.timezone);

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
