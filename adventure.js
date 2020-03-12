const axios = require('axios');
require('dotenv').config();

const {
    ADVENTURE_URL,
    ADVENTURE_KEY,
    ADVENTURE_BEARER
} = process.env

function register() { 
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

function getTest() {
    axios.get(`${ADVENTURE_URL}/`, {
        headers:  {
           'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,
        //    'Content-Type': 'application/json'
    }
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

// getTest();

function register() {
    axios.post(`${ADVENTURE_URL}/request-auth-token`, {
        "apiKey": ADVENTURE_KEY
    })
        .then(function (response) {
            // handle success
            console.log(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};

module.exports = function() {

    function sendToken(ticker, amount, userId){
        axios.post(`${ADVENTURE_URL}/send-token`, {
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
        })
    };

    function getWallet(twitId) {
        axios.get(`${ADVENTURE_URL}/wallet`, {
            params: {
                userId: twitId
            },
            headers: {
                'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,
                //    'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    };

    function postWallet(twitId) {
        axios.post(`${ADVENTURE_URL}/wallet`, {
            params: {
                userId: `${twitId}`
            },
            headers: {
                'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,
                //    'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    };

    return {
        sendToken: sendToken,
        getWallet: getWallet,
        postWallet: postWallet
    };
};

function getWallet(userId = 'test100', idType = 'twitter') {
    const url = `${ADVENTURE_URL}/wallet`
    const data = { userId, idType }
    const config = { headers: { 'Authorization': 'Bearer ' + ADVENTURE_BEARER, } }

    axios.get(url, data, config)
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};

// function getWallet(twitId = '@test', idType = 'twitter') {
//     axios.get(`${ADVENTURE_URL}/wallet`, {
//         params: {
//             userId: twitId,
//             idType: idType
//         },
//         headers: {
//             'Authorization': 'Bearer ' + `${ADVENTURE_BEARER}`,
//             //    'Content-Type': 'application/json'
//         }
//     })
//         .then(function (response) {
//             // handle success
//             console.log(response.data);
//         })
//         .catch(function (error) {
//             // handle error
//             console.log(error);
//         })
// };



function createWallet(userId = 'test100', idType = 'twitter') {    
    const url = `${ADVENTURE_URL}/wallet`
    const data = { userId, idType }
    const config = { headers: { 'Authorization': 'Bearer ' + ADVENTURE_BEARER, } }    
    
    axios.post(url, data, config)
        .then(function (response) {
            // handle success
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};

getWallet();
// createWallet();
// const test = '@TwitterHandle';
// postWallet(test);