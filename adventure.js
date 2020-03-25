const axios = require('axios');
require('dotenv').config();

const {
    ADVENTURE_URL,
    ADVENTURE_BEARER
} = process.env

const url = ADVENTURE_URL
const bearConfig = { headers: { 'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`, } }

module.exports = {
    sendToken,
    postWallet,
    getWallet
};


// Might need idType in the parameter (needs testing)
function sendToken(ticker, amount, userId) {
    axios.post(`${url}/send-token`, {
            "ticker": ticker,
            "amount": amount,
            "userId": userId
    }, {
        'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,
    })
    .then(function (response){
        console.log(response)
    })
    .catch(function (error){
        console.log(error)
    });
};

// Checks if wallet already exists
function getWallet(twitId, idType = 'twitter') {
    const data = { twitId, idType }
    
    axios.get( `${url}/wallet`, data, bearConfig )
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};

// Creates nerw wallet to Adventure
function postWallet(twitId, idType = 'twitter') {
    const data = { twitId, idType }

    axios.post( `${url}/wallet`, data, bearConfig )
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};

// Retrives bearer token from/for Adventure
function _adventBearer() { 
    axios.post(`${ADVENTURE_URL}/request-auth-token`, {
        "apiKey": ADVENTURE_KEY
    })
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};
// Pings Adventure server 
function _getTest() {
    axios.get(`${ADVENTURE_URL}/`, {
        headers:  {'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,}
        })
        .then(function (response) {
            // handle success
            console.log(response.status);
            console.log(response.statusText);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};