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
      // Subscribes to a user's activity
      await webhook.subscribe({oauth_token:process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET});
      
      // Listens to incoming activity
      webhook.on('event', event => console.log('Something happened:', JSON.stringify(event, null, 2)));
      
      webhook.on('event', async (event) => {
          if (event.direct_message_events) {
            console.log('sayHi!')
            await sayHi(event);
          }
      });
  } catch(e) {
      console.error(e);
      process.exit(1);
  }
})();


async function sayHi(event) {
    if (!event.direct_message_events) {
      return;
    }
  
    const message = event.direct_message_events.shift();
    const sender = message.message_create.sender_id;
  
    if (typeof message === 'undefined' || typeof message.message_create === 'undefined') {
      return;
    }
   
    if (message.message_create.sender_id === message.message_create.target.recipient_id) {
      return;
    }
  
    await markAsRead(message.message_create.id, message.message_create.sender_id, oAuthConfig);
    await indicateTyping(message.message_create.sender_id, oAuthConfig);
  
    const senderScreenName = event.users[message.message_create.sender_id].screen_name;
    console.log(`${senderScreenName} says ${message.message_create.message_data.text}`);
  
    const requestConfig = {
      url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
      authorization: 'oAuth',
      oauth: oAuthConfig,
      json: {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: message.message_create.sender_id,
            },
            message_data: {
              text: `Hi @${senderScreenName}! 👋`,
            },
          },
        },
      },
    };
    await post(requestConfig);  
};





async function markAsRead(messageId, senderId, auth) {
    const requestConfig = { 
        url: 'https://api.twitter.com/1.1/direct_messages/mark_read.json',
        form: {
            last_read_event_id: messageId, 
            recipient_id: senderId,
        },
        authorization: 'oAuth',
        oauth: auth,
    };
    await post(requestConfig)
};

async function indicateTyping(senderId, auth) {
    const requestConfig = {
        url: 'https://api.twitter.com/1.1/direct_messages/indicate_typing.json',
        form: {
            reicipient_id: senderId,
        },
        authorization: 'oAuth', 
        oauth: auth,
    };
    await post(requestConfig)
};
