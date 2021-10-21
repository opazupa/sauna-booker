import { google } from 'googleapis';
import { DateTime } from 'luxon';

import { Configuration } from '../configuration';

const calendar = google.calendar('v3');

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(Configuration.google.clientId, Configuration.google.clientSecret);
// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: Configuration.google.refreshToken,
});

/**
 * Calendar invite params
 */
type InviteParams = {
  end?: DateTime;
  start?: DateTime;
};

/**
 * Craete calendar invite based on configuration
 *
 * @param {InviteParams} params
 */
export const createInvite = (params: InviteParams) => {
  oauth2Client
    .getRequestHeaders()
    .then(() =>
      calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        requestBody: {
          summary: 'Saunavuoro 💥',
          location: 'Harjus kattosauna',
          end: {
            dateTime: params.end.toString(),
            timeZone: Configuration.booking.timezone,
          },
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 30 }],
          },
          start: {
            dateTime: params.start.toString(),
            timeZone: Configuration.booking.timezone,
          },
          attendees: Configuration.google.attendees.map((email: string) => {
            return { email };
          }),
        },
      }),
    )
    .catch((err) => console.error(err));
};
