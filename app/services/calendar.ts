import { google } from 'googleapis';
import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const calendar = google.calendar('v3');
const { refreshToken, attendees, clientId, clientSecret } = Configuration.google;
const { booking } = Configuration;

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

/**
 * Calendar invite params
 */
type InviteParams = {
  end?: DateTime;
  start?: DateTime;
  timeZone?: string;
};

/**
 * Craete calendar invite based on configuration
 *
 * @param {InviteParams} params
 */
export const createInvite = async ({ end, start, timeZone }: InviteParams) => {
  await oauth2Client
    .getRequestHeaders()
    .then(() =>
      calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        sendUpdates: 'all',
        requestBody: {
          summary: 'Saunavuoro 💥',
          location: 'Harjus kattosauna',
          end: {
            dateTime: end.toString(),
            timeZone,
          },
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
          },
          description: booking.site,
          source: {
            title: booking.site,
            url: booking.site,
          },
          start: {
            dateTime: start.toString(),
            timeZone,
          },
          attendees: attendees.map((email: string) => ({ email })),
        },
      }),
    )
    .then(({ statusText, data }) => {
      console.log(`${statusText} added calendar event with data: ${JSON.stringify(data)}`);
    })
    .catch((err) => console.error(err));
};
