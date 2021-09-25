import axios from 'axios';

import { Configuration } from '../configuration';

const { chatId, botToken } = Configuration.telegram;

/**
 * Send text notification via Telegram
 *
 * @param {string} text
 */
export const sendNotification = async (text: string) => {
  await axios.post(
    `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`,
  );
};
