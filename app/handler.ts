import { Handler } from 'aws-lambda';
import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

import { Configuration } from './configuration';
import { wrapHandler } from './utils';

const { isDev } = Configuration;

/**
 * Book next time for sauna
 */
export const bookNext: Handler = wrapHandler(async () => {
  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args,
    headless: !isDev(),
  });

  const page = await browser.newPage();

  await page.goto('https://google.com');
  console.log('navigated');
  const screenshot = await page.screenshot({ encoding: 'base64' });
  console.log(screenshot);
});
