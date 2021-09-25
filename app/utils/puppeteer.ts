import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

import { IConfiguration } from '../configuration';

export const setup = async (config: IConfiguration) => {
  const browser = await puppeteer.launch({
    executablePath: config.isDev() ? config.chromeExecPath : await chrome.executablePath,
    args: config.isDev() ? ['--no-sandboxs'] : chrome.args,
    headless: !config.isDev(),
  });
  const page = await browser.newPage();
  return { browser, page };
};
