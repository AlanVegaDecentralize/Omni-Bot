const twit = require('./twit');
const advent = require('./adventure');

/*ON USER FOLLOW:
 * 1. follow back user 
 * 2. create user wallet
 * 3. Pm user instructions on how to use the bot
 */
const confirmed = ['200 OK']
const failed = ['403 Forbidden']

// https://etherscan.io/address/
// https://etherscan.io/tx/


// When user follows Omni, omni follows back, creates wallet and DM's the user
async function onFollow(userId) {
    const welcomeMsg = `Welcome to Omni ${userId}! `
    const walletRes = () = await advent.getWallet(userId)
    const followProcess = () = await twit.follow(userId)
    
    if ( walletRes == failed ) {
        await advent.postWallet(userId)
    };
    
    if ( followProcess == confirmed ){ 
        await twit.dm(welcomeMsg, userId)
    };
};

// User Dm's bot 'wallet' to request wallet
async function onDMevent(contents, userId) {
    const msg = contents.toLowerCase()
    const wallet = () = advent.getWallet(userId.publicKey)
    const response = `Here's your wallet: https://etherscan.io/address/${wallet}`

    if (msg == "wallet") {
        await twit.dm(response, userId)
    }
};