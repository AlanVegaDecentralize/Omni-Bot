require('dotenv').config();

const twit = require('./twit');
const advent = require('./adventure.js')
const { Autohook } = require('twitter-autohook');
const util = require('util');
const request = require('request');


const post = util.promisify(request.post);
// const PORT = 3000;

// const {
//     TWITTER_CONSUMER_KEY,
//     TWITTER_CONSUMER_SECRET,
//     TWITTER_ACCESS_TOKEN,
//     TWITTER_ACCESS_TOKEN_SECRET,
//     OMNI_URL,
//     OMNI_KEY,
//     OMNI_BEARER
// } = process.env

const oAuthConfig = {
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_KEY_SECRET,
    env: process.env.TWITTER_WEBHOOK_ENV
};

(async () => {
  try{
      const webhook = new Autohook();
      // Removes existing webhooks
      await webhook.removeWebhooks();
      // Starts a server and adds a new webhook
      await webhook.start();
      // Subscribes to a omni activity
      await webhook.subscribe({oauth_token:process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET});
      
      // Listens to incoming activity
      webhook.on('event', event => console.log('Something happened:', JSON.stringify(event, null, 2)));
      
      webhook.on('event', async (event) => {
        if (event.)
        

        if (event.direct_message_events) {
          console.log('sayHi!')
          await sayHi(event);
        };
      })
  } catch(e) {
      console.error(e);
      process.exit(1);
  }
})();

