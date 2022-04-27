const axios = require('axios');

const { API_WIZ_URL, API_WIZ_CORE_URL, API_WIZ_TOKEN } = require('../../Config/Env');

const WizAutoHttp = axios.default.create({
  baseURL: API_WIZ_URL,
  headers: {
    'X-Api-Key': API_WIZ_TOKEN,
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 15000
});

const WizCoreHttp = axios.default.create({
  baseURL: API_WIZ_CORE_URL,
  headers: {
    'X-Api-Key': API_WIZ_TOKEN,
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 15000
});

module.exports = { WizAutoHttp, WizCoreHttp };
