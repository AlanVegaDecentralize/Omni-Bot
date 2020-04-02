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
		// webhook.on('event', (event) => {
		// 	console.log('New event: ', event.tweet_create_events[0].in_reply_to_screen_name);
		// })
	
		webhook.on('event', async(event) => {
			
			// On user follow
			if (event.follow_events && (event.follow_events[0].type == 'follow')) {
				let twitUser = event.follow_events[0].source.screen_name
				let twitId = event.follow_events[0].source.id
				
				await auto.onFollow(twitId, twitUser)
				.then((res) => console.log(res))
				.catch((err) => console.log(err)) 
			};

			// On user unfollow
			if (event.follow_events && (event.follow_events[0].type == 'unfollow')) {
				let twitUser = event.follow_events[0].source.screen_name
				let twitid = event.follow_events[0].source.id

				twit.unfollow(twitUser)
				.then((res) => console.log(res))
				.catch((err) => console.log(err))
			};

				if (event.tweet_create_events[0] && (event.tweet_create_events[0].in_reply_to_screen_name == 'FyiOmni')) {
					
					// let twitUser = event.tweet_create_events[0].user.screen_name
					let tweet = event.tweet_create_events[0].text
					// console.log('TwitUser: ', twitUser, 'TwitId: ', twitId, 'Tweet: ', tweet)
					try{
						let txTweet = auto.txInfoExtract(tweet)
						if(txTweet.amount && txTweet.users && txTweet.ticker){
							console.log(txTweet.amount[0], txTweet.users[0], txTweet.ticker)
							let i;
							for ( i = 0; i < txTweet.users.length; i++ ) {
								// Will not send tokens to twitter users who don't follow Omni 
								// ~Might remove to allow more inclusivity~
								// await advent.getWallet(txTweet.users[i]).then(
								// 	(results) => {
								// 	if (results.status == 200) {
								// 		console.log('We here but not here');
								// 		advent.sendToken(txTweet.ticker, txTweet.amount[0], txTweet.users[0])
								// 		.then((result) => {console.log(result)})
								// 		.catch((err) => {console.error(err)});
								// 	};
								// });
							}
						}
					} catch(e) {
						console.log(e)
					}
				};
		});
	} catch(e) {
		console.error(e);
		process.exit(e);
	}
	})();



