/* eslint-disable @typescript-eslint/ban-types */
import chrome from 'chrome-aws-lambda';
import puppeteer, { Page } from 'puppeteer-core';

import { IConfiguration } from '../configuration';

export const setup = async (config: IConfiguration) => {
  const browser = await puppeteer.launch({
    executablePath: config.isDev() ? config.chromeExecPath : await chrome.executablePath,
    args: config.isDev() ? ['--no-sandboxs'] : chrome.args,
    devtools: config.isDev(),
    headless: !config.isDev(),
    slowMo: config.isDev() ? 250 : null,
  });
  const page = await browser.newPage();
  return { browser, page };
};

export const shortPause = async (page: Page) => {
  const pauseTime = 5000;
  await page.waitForTimeout(pauseTime);
};

export const repeatClick = async (page: Page, selector: string, times: number) => {
  for (let index = 0; index < times; index++) {
    await page.click(selector);
  }
};
