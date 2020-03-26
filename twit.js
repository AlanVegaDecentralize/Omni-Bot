require('dotenv').config('./env');
const Twitter = require('twitter-lite');
const {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET
} = process.env;

// create client 
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

module.exports =  {
    dm: dm,
    follow: follow,
    unfollow: unfollow
};

async function _auth(client) {    
    try {
        await client.get('account/verify_credentials');
    } catch (e) {
        console.log(e);
    }    
};

// DM's 
async function dm(content, target_screen_name) {
    let status
    const response = await client.post('direct_messages/events/new', {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: target_screen_name,
                },
                message_data: {
                    text: content, 
                },
            },
        },
    })
        .then( status = (res) => res._headers.status )
        .catch( status = (err) => err._headers.status );
};
// Follow target_screen_name (Twitter handle) @example
async function follow(target_screen_name) {
    let status
    const response = await client.post('friendships/create', {
        screen_name: target_screen_name})
        .then(status = (res) => res._headers.status )
        .catch(status = (err) => err._headers.status )
    // console.log(`${target_screen_name} follow process: ` + response)
    return response
};

// Unfollows target_screen_name (Twitter handle) @example
async function unfollow(target_screen_name) {
    let status
    const response = await client.post('friendships/destroy', {
        screen_name: target_screen_name })
    .then( status = (res) => res._headers.status )
    .catch( status = (err) => err._headers.status )
    // console.log(`${target_screen_name} unfollow process: ` + response)
    return response
};