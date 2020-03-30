const twit = require('./twit');
const advent = require('./adventure');


const confirmed = ['200 OK']
const forbidden = ['403 Forbidden']
const failed = [400]

// https://etherscan.io/address/
// https://etherscan.io/tx/

// When user follows Omni, omni follows back, creates wallet and DM's the user
async function onFollow(userId, twit_screen_name) {
    const welcomeMsg = `Welcome to Omni ${twit_screen_name}!`;
    let info = {};
    await advent.getWallet(twit_screen_name)
        .then((result) => {(result.status == 200) ? 
        console.log(result) : 
        advent.postWallet(twit_screen_name).then((result) => info.push({result}))
    });

    await twit.follow(userId)
        .then((result) => {(result.status == confirmed) ?
        twit.dm(userId, twit_screen_name, welcomeMsg).then((result) => info.push({result})) :
        console.log(`Follow for ${twit_screen_name} failed`)
    });

    return info
};

// User Dm's bot 'wallet' to request wallet (twitId = serialized account number)
async function onDMevent(twitId, twit_screen_name, contents) {
    const msg = contents.toLowerCase();
    const response = `Here's your wallet: https://etherscan.io/address/${wallet}`

    const wallet = () => advent.getWallet(twit_screen_name.publicKey)
        .then()
};

module.exports = {
    onFollow,
    onDMevent
};