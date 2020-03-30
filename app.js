require('dotenv').config();

const twit = require('./twit');
const advent = require('./adventure')
const auto = require('./auto')
const { Autohook } = require('twitter-autohook');

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
      // Subscribes to omni.fyi activity
      await webhook.subscribe({oauth_token:process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET});

      // Listens to incoming activity

      webhook.on('event', (event) => {
        console.log('New event: ', event)});

      webhook.on('event', (event) => {

        if (event.follow_events[0].type == 'follow') {
          let twitUser = event.follow_events[0].source.screen_name
          let id = event.follow_events[0].source.id
          let welMsg = `Welcome to Omni ${twitUser}!`
          async () => {
            await twit.follow(twitUser)
            await twit.dm(id, twit, welMsg)
            await advent.postWallet(`${twitUser}`)
          }
        };
        // (event.follow_events[0].type == 'follow') ? twit.follow(event.follow_events[0].source.screen_name): console.log('Failed to follow back: ', event.follow_events[0].source.screen_name )
        // (event.follow_events[0].type == 'follow') ? twit.dm(event.follow_events[0].source.screen_name)
        // (event)
        // (event.tweet_create_events[0].)
        // // (twitObj.tweet_create_events == )
        if (event.follow_events[0].type == 'unfollow') {
          let twitUser = event.follow_events[0].source.screen_name
          let id = event.follow_events[0].source.id

          await twit.unfollow(twitUser)
          
        } 
      });
  } catch(e) {
      console.error(e);
      process.exit(e);
  }
})();



