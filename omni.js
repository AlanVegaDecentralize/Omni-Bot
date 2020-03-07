const axios = require('axios');
require('dotenv').config();

const {
    OMNI_URL,
    OMNI_KEY
} = process.env




function bearer_token() {
    axios.post(`${OMNI_URL}/request-auth-token`, {
        "apiKey": OMNI_KEY
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

// const address = "http://localhost:8000"function 
function getTest(bearer_token) {
    axios.get(`${address}/`, {
        headers:  {
           'Authorization': 'Bearer ' + bearer_token,
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

function register() {
    axios.post(`${address}/request-auth-token`, {
        "apiKey": "d71116ed-9797-47fd-8dc1-c4bbb2313add"
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

function sendToken(ticker, amount, userId, bearer_token){
    axios.post(`${address}/send-token`, {
            "ticker": "BERNIE",
            "amount": 1000,
            "userId": "test@test.com"
    }, {
           'Authorization': 'Bearer ' + bearer_token,
    })
    .then(function (response){
        console.log(response)
    })
    .catch(function (error){
        console.log(error)
    })
};

function getWallet(twitId, bearer_token()) {
    axios.get(`${address}/wallet`, {
        params: {
            userId: twitId
        },
        headers: {
            'Authorization': 'Bearer ' + bearer_token,
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