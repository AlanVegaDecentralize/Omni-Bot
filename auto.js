const twit = require('./twit');
const advent = require('./adventure');

const confirmed = ['200 OK']
const forbidden = ['403 Forbidden']
const failed = [400]

// https://etherscan.io/address/
// https://etherscan.io/tx/

module.exports = {
    onFollow,
	walletRequest,
	txInfoExtract
};

// When user follows Omni, omni follows back, creates wallet and DM's the user
async function onFollow(userId, twitUser) {
	// Prevents the bot from following iteself ['403']
	if (userId == '1234326202699005954') {
		return
	}
	let wallet;
	// Checks if new followers has a omni wallet 
	// If they do logs wallet; if not creates wallet
    await advent.getWallet(twitUser)
		.then((result) => { 
			(result.status == 200) ? 
			wallet = result.data.publicKey:
			advent.postWallet(twitUser)
			.then((result) => {console.log(`${twitUser} wallet: `, result);
			wallet = result.data.address});
			;
		});
	// Follows back users and sens welcome msg with omni wallet info
    await twit.follow(twitUser)
        .then((result) => {
			let welcomeMsg = `Welcome to Omni ${twitUser}!\nYour generated Ethereum wallet: https://etherscan.io/address/${wallet}`;
			twit.dm(userId, welcomeMsg)
            .then((result) => console.log(`${twitUser}'s welcome message: `, result.status))
            .catch((err) => console.log(err))
    });
};

// User Dm's bot 'wallet' to request wallet (twitId = serialized account number)
async function walletRequest(twitUser, twitId) {
	if (twitUser == 'FyiOmni') {
		return
	}
    let response
	let wallet
	console.log(`wallet request from: ${twitUser}`)
	// Grabs wallet 
	await advent.getWallet(twitUser)
	.then((result) => {
		wallet = result.data.publicKey;
		response = `https://etherscan.io/address/${wallet}`
		twit.dm(twitId, response)
		.then((result) => {console.log(result.status)})
		.catch((err) => {console.log(err)})})
	.catch((err) => console.log(err))
};

// Extracts transaction info from tweet (Bot must be mentioned i.e. @FyiOmni)
function txInfoExtract(tweet) {
	let output = {}
	// Token List 
	const tokens = ['XOMNImv', 'XOMNI', 'PETCARE', 'UCLASUPREME', 'TANKGOD','HYPEKILLS', 'RSCH', 'SS2', 'CAR', 'JAMIWA', 'ACIDWINE', 'GRATITUDE', 'HELLO', 'DEEPBLUE', 'FISHCLUB', 'POTTA', '2SWIM', 'DUNKONYOU', 'GINANDJUICE', 'SONNET18', 'OKBOOMER', 'JOLENE', 'ILIKEYOURTIKTOK', 'HOTPOTATO', 'BERNIE']
	// Regexp
	const amtTicReg = /send\s\d*\s\w*/gi
	const amtReg = /[0-9]\d*/gi
	const ticReg = /[a-zA-z]\w*/gi
	const usersReg = /(?<=@)[_a-zA-Z]\w*/gi
	// Returns grouped tx info from tweet
	if (tweet.match(amtTicReg)) {
		const res = tweet.match(amtTicReg)
		const usersList = tweet.match(usersReg)
		const amt = res[0].match(amtReg)
		const markers = res[0].match(ticReg)
		const tickers = markers.map(function(x) { return x.toUpperCase() })
		let ticker
		let users
		// Designates tocken ticker
		if (tokens.includes(tickers[1])) {
			ticker = tickers[1]
		} else {
			ticker = null
		}
		// Filters out FyiOmni from users list 
		users = usersList.filter((n) => { return n != 'FyiOmni'})

		output = {
			amount: amt,
			users: users,
			ticker: ticker
		}

		return output
	} else {
		console.log('not a tweet tx')
	}
};
