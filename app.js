require('dotenv').config();

const twit = require('./twit');
const advent = require('./adventure')
const auto = require('./auto')
const { Autohook } = require('twitter-autohook');


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
		// 	console.log('New event:', event)
		// 	}
		// });

		// BOT
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

			// Transaction tweet (REQUIREMENTS: 'send 123123 BERNIE @FyiOMNI @Recipient_Handle')
			if (event.tweet_create_events && (event.for_user_id == process.env.TWITTER_BOT_ID)) {
				let tweet = event.tweet_create_events[0].text
				let sendReg = /send/gi
				let key = tweet.match(sendReg)
				if (key != null) {
					key[0].toLowerCase()
				};
				// console.log('TwitUser: ', twitUser, 'TwitId: ', twitId, 'Tweet: ', tweet)
				if(key != null && (key.includes('send') == true)){
					let txTweet = auto.txInfoExtract(tweet)
					if(txTweet.amount && txTweet.users && txTweet.ticker){
						console.log(txTweet.amount[0], txTweet.ticker, txTweet.users[0])
						let i;
						for ( i = 0; i < txTweet.users.length; i++ ) {
							// Will not send tokens to twitter users who don't follow Omni 
							// ~Might remove to allow more inclusivity~
							advent.getWallet(txTweet.users[i]).then(
								(results) => {
								if (results.status == 200) {
									console.log('Tweet tx submitted:');
									advent.sendToken(txTweet.ticker, txTweet.amount[0], txTweet.users[0])
									.then((result) => console.log(result))
									.catch((err) => console.error(err))
								};
							});
						};
					};
				} else {
					console.log('Tweet mention: not a tweet tx')
				};
			};
			// Handles wallet request from follower (User dm's Omni bot any message with 'wallet' keyword)
			if (event.direct_message_events && (event.direct_message_events[0].type == 'message_create')) {
				const walletReg = /wallet/gi
				let tweet = event.direct_message_events[0].message_create.message_data.text 
				let twitId = event.direct_message_events[0].message_create.sender_id
				let twitUser = event.users[twitId].screen_name

				if (tweet.match(walletReg)) {
					const msg = tweet.match(walletReg)
					const key = msg[0].toLowerCase()
					
					await auto.walletRequest(twitUser, twitId)
					.then((result) => {console.log(result)})
					.catch((err) => {console.log(err)});
				} else {
					console.log('Not wallet request')
				};
			};
		});
	} catch(e) {
		console.error(e);
		process.exit(e);
	}
})();