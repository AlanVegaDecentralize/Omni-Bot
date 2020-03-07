const Twitter = require("twitter-lite");
require('dotenv').config();

const 

// const client = new Twitter({
//     subdomain: "api",
//     version: "1.1",
//     consumer_key: process.env.TWIT_API_KEY,
//     consumer_secret: process.env.TWIT_API_SECRET_KEY,
//     access_token_key: process.env.TWIT_TOKEN,
//     access_token_secret: process.env.TWIT_TOKEN_SECRET
// });

// client
//     .get("account/verify_credentials")
//     .then(results => {
//         console.log("results", results);
//     })
//     .catch(console.error);



async function boom() {

    const user = new Twitter({
        consumer_key: process.env.TWIT_API_KEY,
        consumer_secret: process.env.TWIT_API_KEY_SECRET
    });

    const response = await user.getBearerToken();
    const app = new Twitter({
        bearer_token: response.access_token
    });
    console.log(app) 
};

boom();