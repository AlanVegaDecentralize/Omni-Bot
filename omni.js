const axios = require('axios');
require('dotenv').config();

const omniURL = process.env.OMNI_API;
const omniKEY = process.env.OMNI_KEY;


async function makeRequest() {

    const config = {
        method: 'POST',
        url: `${omniURL}/request-auth-token`,
        apiKey: `${omniKEY}`
    };

    const omni = await axios(config)
        .then((response) => console.log(response))
        .catch((error) => console.log(error))

    // axios.post(`${omniURL}/request-auth-token`, {
    //     'apiKey': `${omniKEY}`
    // })
    // .then((response) => console.log(response.data))
    // .catch((error) => console.log(error))
};

makeRequest();