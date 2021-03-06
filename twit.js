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

// 15 rate limit/15 Mins.
async function _isUserFollowing(userId) {
    let following;
    
    await client.get('/friendships/lookup', {
        "screen_name": userId
    }).then((result) => {
        if ((result._headers.status = '200 OK') && (result[0].connections == 'following')) {
            following = true
        } else {
            following = false
        }})
    .catch((err) => console.log(err))

    return following
};

// Direct Message 
async function dm(userId, content, target_screen_name = null) {
    let status;
    await client.post('direct_messages/events/new', {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: userId,
                },
                message_data: {
                    text: content, 
                },
            },
        },
    })
        .then( (res) => { status = {status: res._headers.status, res: res} })
        .catch( (err) => { console.log(err) });

    return status
};

// Follow target_screen_name (Twitter handle) 
async function follow(target_screen_name) {

    let content;
    await client.post('friendships/create', {
        screen_name: target_screen_name})
        .then((res) => {return content = res._headers.status })
        .catch((err) => {return content = err });
    // console.log(`${target_screen_name} follow process: ` + status);
    return content
};

// Unfollows target_screen_name (Twitter handle) @example
async function unfollow(target_screen_name) {
    let content;
    await client.post('friendships/destroy', {
        screen_name: target_screen_name })
    .then((res) => { content = res._headers.status })
    .catch((err) => { content = err._headers.status});
    console.log(`Unfollowing ${target_screen_name}: ` + content);
    return content
};