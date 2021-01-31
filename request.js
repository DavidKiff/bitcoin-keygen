const axios = require("axios");
const bitcoin = require("bitcoinjs-lib");

module.exports = {
    getAddressInfo: async (address) => {
    const url = `https://blockchain.info/address/${address}?format=json`;
    try {
      return await axios.get(url);
    } catch (e) {
      throw new Error(e);
    }
  },
  generateKeyPairs: async () => {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    const publicKey = keyPair.publicKey.toString("hex");
    const privateKey = keyPair.toWIF();
    return { address, privateKey, publicKey };
  },
};
