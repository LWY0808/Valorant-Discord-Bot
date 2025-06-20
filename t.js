require('dotenv').config();

const axios = require('axios');
axios.defaults.headers.common['Authorization'] = process.env.HENRIK_API_KEY;

async function getAccount() {
    const response = await axios.get('https://api.henrikdev.xyz/valorant/v1/account/gaoxiaolehni/0001');
    console.log('Request Headers:', response.config.headers);
    console.log('Response Headers:', response.headers);
}

getAccount();