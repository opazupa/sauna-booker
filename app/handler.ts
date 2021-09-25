import { Handler } from 'aws-lambda';

import { Configuration } from './configuration';
import { bookSaunaSlot } from './services/booking';
import { setup, wrapHandler } from './utils';

/**
 * Book next time for sauna
 */
export const bookNext: Handler = wrapHandler(async () => {
  const { browser, page } = await setup(Configuration);
  try {
    await bookSaunaSlot(page);
    browser.close();
  } catch (err) {
    console.error(err);
    browser.close();
    throw err;
  }
});
