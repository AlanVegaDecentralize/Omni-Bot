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

// Might need senderId & idType in the parameter (needs testing)
async function sendToken(ticker, amount, userId) {
    let output = {}
    
    await axios.post(`${url}/send-token`, {
        "ticker": ticker,
        "amount": amount,
        "userId": userId
    }, bearConfig)
    .then( function(response) { return output = {status: response.status, data: response.data} })
    .catch( function(error) { return output = { status: error.status }});

    return output
};

// Calls for eth address 
async function getWallet(userId) {
    const URL = `${url}/wallet`
    const data = {params: {userId: userId}, headers: {'Authorization': 'Bearer ' + ADVENTURE_BEARER}}
    let wallet = {}
    
    await axios.get(URL, data)
    .then( function(response) { return wallet = {status: response.status, data : response.data, wallet: response.data.publicKey }})
    .catch( function(error) { return wallet = { status: error.response.status}} );
    
    return wallet
};

// Creates new wallet to Adventure
async function postWallet(userId, idType = 'twitter') {
    const data = { userId, idType }
    let wallet = {}

    await axios.post( `${url}/wallet`, data, bearConfig )
    .then( function(response) {return wallet = {status:response.status, data: response.data}})
    .catch( function(error) { return error.status});

    return wallet
};

// Retrives bearer token from/for Adventure
function _adventBearer() { 
    axios.post(`${ADVENTURE_URL}/request-auth-token`, {"apiKey": ADVENTURE_KEY})
        .then(function (response) {console.log(response.data)})
        .catch(function (error) {console.log(error)});
};

// Pings Adventure server 
function _getTest() {
    axios.get(`${ADVENTURE_URL}/`, {
        headers:  {'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,}})
        .then(function (response) {
            console.log(response.status);
            console.log(response.statusText);})
        .catch(function (error) {console.log(error);})
};