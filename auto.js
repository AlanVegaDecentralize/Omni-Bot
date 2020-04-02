const twit = require('./twit');
const advent = require('./adventure');


const confirmed = ['200 OK']
const forbidden = ['403 Forbidden']
const failed = [400]

// https://etherscan.io/address/
// https://etherscan.io/tx/

// When user follows Omni, omni follows back, creates wallet and DM's the user
async function onFollow(userId, twit_screen_name) {
	let wallet = null
	const welcomeMsg = `Welcome to Omni ${twit_screen_name}!\nHere's your wallet: ${wallet}`;
    await advent.getWallet(twit_screen_name)
		.then((result) => { 
			(result.status == 200) ? 
        	console.log(result):advent.postWallet(twit_screen_name).then((result) => {console.log(`${twit_screen_name} wallet: `, result)})
	});

    await twit.follow(twit_screen_name)
        .then((result) => {
			twit.dm(userId, welcomeMsg)
            .then((result) => {console.log(`${twit_screen_name}'s welcome message: `, result.status)})
            .catch((err) => console.log(err))
    });
};

// User Dm's bot 'wallet' to request wallet (twitId = serialized account number)
async function onDMevent(twitId, twit_screen_name, contents) {
    const msg = contents.toLowerCase();
    const response = `Here's your wallet: https://etherscan.io/address/${wallet}`

    await advent.getWallet(twit_screen_name)
        .then()
};

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

module.exports = {
    onFollow,
	onDMevent,
	txInfoExtract
};