const axios = require('axios');
require('dotenv').config();

const omniURL = process.env.OMNI_URL;
const omniKEY = process.env.OMNI_KEY;




function register() {
    axios.post(`${omniURL}/request-auth-token`, {
        "apiKey": omniKEY
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

register();