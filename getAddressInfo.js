const chalk = require("chalk");
const axios = require("axios");

async function getAddressInfo(address) {
  const url = `https://blockchain.info/address/${address}?format=json`;
  // const url = `https://blockchain.info/unspent?active=${address}`;
  try {
    return await axios.get(url);
  } catch (e) {
    console.log(chalk.red(`Failed to fetch ${url}`));
  }
}

module.exports = getAddressInfo;
