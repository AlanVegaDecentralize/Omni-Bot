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
			console.log(result):
			await advent.postWallet(twitUser)
			.then((result) => console.log(`${twitUser} wallet: `, result));
			wallet = result.data.publicKey;
		});
	// Follows back users and sens welcome msg with omni wallet info
    await twit.follow(twitUser)
        .then((result) => {
			let welcomeMsg = `Welcome to Omni ${twitUser}!\nYour generated Ethereum wallet: ${wallet}`;
			await twit.dm(userId, welcomeMsg)
            .then((result) => console.log(`${twitUser}'s welcome message: `, result.status))
            .catch((err) => console.log(err))
    });
};

// User Dm's bot 'wallet' to request wallet (twitId = serialized account number)
async function walletRequest(twitUser, twitId) {
    let response
	let wallet
	console.log(`wallet request from: ${twitUser}`)
	// Grabs wallet 
	await advent.getWallet(twitUser)
	.then((result) => {
		wallet = result.data.publicKey;
		response = `Here's your wallet: https://etherscan.io/address/${wallet}`
		twit.dm(twitId, response)
		.then((result) => {console.log(result.status)})
		.catch((err) => {console.log(err)})})
	.catch((err) => console.log(err))
};

// Extracts transaction info from tweet (Bot must be mentioned i.e. @FyiOmni)
function txInfoExtract(tweet) {
	let output = {}
	// Token List 
	const testNet = ['__XOMNI2', '__XOMNI']
	const mainNet = ['XOMNIMV', 'XOMNI', 'PETCARE', 'MKNJ', 'MTNJ', 'UCLA', 'TANK', 'HYPE','ACIDWINE', 'GRATITUDE', 'HELLO', 'DEEPBLUE', 'FISHCLUB', 'SWIM', 'POTTA', 'DUNKONYOU', 'GINANDJUICE', 'SONNET18', 'OKBOOMER','BERNIE', 'JOLENE', 'ILIKEYOURTIKTOK', 'HOTPOTATO']
	// Regexp
	const amtTicReg = /send\s[0-9]\d*\s([_a-zA-Z]\w*)/gi
	const amtReg = /[0-9]\d*/gi
	const ticReg = /[a-zA-z]\w*/gi
	const usersReg = /(?<=@)[_a-zA-Z]\w*/gi
	// Returns grouped tx info from tweet
	const res = tweet.match(amtTicReg)
	const usersList = tweet.match(usersReg)
	const amt = res[0].match(amtReg)
	const markers = res[0].match(ticReg)
	const tickers = markers.map(function(x) { return x.toUpperCase() })
	let ticker
	let users
	// Designates tocken ticker
	if (mainNet.includes(tickers[1]) | testNet.includes(tickers[1])) {
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
};