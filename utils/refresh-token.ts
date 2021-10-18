import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import http from 'http';
import opn from 'open';
import destroyer from 'server-destroy';
import url from 'url';

dotenv.config({ path: './.env.local' });

const { GOOGLE_CALENDAR_CLIENT_SECRET, GOOGLE_CALENDAR_CLIENT_ID } = process.env;

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CALENDAR_CLIENT_ID,
  GOOGLE_CALENDAR_CLIENT_SECRET,
  'http://localhost:3000/callback',
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

/**
 * Open an http server to accept the oauth callback.
 * In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate(scopes: string[]) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
      prompt: 'consent',
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url && req.url.indexOf('/callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.close();
            const { tokens } = await oauth2Client.getToken(qs.get('code'));
            oauth2Client.setCredentials(tokens);
            resolve(oauth2Client);
            console.log('Here´s the refresh token:');
            console.log(tokens.refresh_token);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

const scopes = ['https://www.googleapis.com/auth/calendar.events'];
authenticate(scopes).catch(console.error);
