require('dotenv').config();

const Twitter = require('twitter-lite');

const {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET
  } = process.env
  
//create client 
const client =  new Twitter({
    subdomain: 'api',
    consumer_key:TWITTER_CONSUMER_KEY,
    consumer_secret:TWITTER_CONSUMER_SECRET,
    access_token_key:TWITTER_ACCESS_TOKEN,
    access_token_secret:TWITTER_ACCESS_TOKEN_SECRET,
    });


const user = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
});

const response = async () => await user.getBearerToken();

const app = async () => await new Twitter({
    bearer_token: response.access_token,
});

module.exports = function(client) {

    async function auth(client) {    
        try {
            await client.get('account/verify_credentials');
        } catch (e) {
            console.log(e);
        }    
    };    

    async function dm(content, target_screen_name) {
        const message = await content;
        const rec = await target_screen_name;
        
        const response = await client.post('direct_messages/events/new', {
            event: {
                type: 'message_create',
                message_create: {
                    target: {
                        recipient_id: rec,
                    },
                    message_data: {
                        text: message, 
                    },
                },
            },
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    async function follow(target_screen_name) {
        const response = await client.post('friendships/create', {
            screen_name: target_screen_name,
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    async function unfollow(target_screen_name) {
        const response = await client.post('friendships/destroy', {
            screen_name: target_screen_name 
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }

    return {
        auth: auth,
        dm: dm,
        follow: follow,
        unfollow: unfollow
    }
};

