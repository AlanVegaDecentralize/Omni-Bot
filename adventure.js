const axios = require('axios');
require('dotenv').config('./env');

const {
    ADVENTURE_URL,
    ADVENTURE_KEY,
    ADVENTURE_BEARER
} = process.env


module.exports = {
    sendToken,
    postWallet,
    getWallet
};

const bearConfig = { headers : { 'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}` } };
const url = `${ADVENTURE_URL}`

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
function getWallet(userId) {
    const data = { userId }
    let wallet

    axios.get(`${url}/wallet`, data, bearConfig)
        .then( wallet = (res) => res.data.publicKey )
        .catch( (err) => console.log(err));
};

// Creates nerw wallet to Adventure
function postWallet(userId, idType = 'twitter') {
    const data = { userId, idType }
    let status
    axios.post( `${url}/wallet`, data, bearConfig )
    .then( status = (res) => res.status )
    .catch( (err) => console.log(err));
    
    return status
};

// Retrives bearer token from/for Adventure
function _adventBearer() { 
    axios.post(`${ADVENTURE_URL}/request-auth-token`, {
        "apiKey": ADVENTURE_KEY
    })
        .then(function (response) {
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