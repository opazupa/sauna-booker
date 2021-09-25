import { Handler } from 'aws-lambda';

import { Configuration } from './configuration';
import { bookSlot } from './services/sauna';
import { setup, wrapHandler } from './utils';

/**
 * Book next time for sauna
 */
export const bookNext: Handler = wrapHandler(async () => {
  const { browser, page } = await setup(Configuration);
  try {
    await bookSlot(page);
  } catch {
    browser.close();
  }
  browser.close();
});
