const fs = require("fs");
const path = require("path");
const request = require("./request");
const axios = require("axios");
const bitcoin = require("bitcoinjs-lib");

function getNewKeyPairs() {
  const keyPair = bitcoin.ECPair.makeRandom();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  const publicKey = keyPair.publicKey.toString("hex");
  const privateKey = keyPair.toWIF();
  return { address, privateKey, publicKey };
}

async function getAddressInfo(address) {
  const url = `https://blockchain.info/address/${address}?format=json`;
  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(e);
  }
}

const megaKeys = 1024 * 1024;

let keys = [];

function saveKeys() {
  const dataFolder = path.join(__dirname, "data");
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
  fs.writeFileSync(
    path.join(dataFolder, Date.now().toString() + ".json"),
    JSON.stringify(keys, null, 2),
    { encoding: "utf8" }
  );
}

process.on("SIGINT", function () {
  saveKeys();
  process.exit();
});

(async function () {
  while (true) {
    let key = getNewKeyPairs();
    const info = await getAddressInfo(key.address);
    key.info = info.data;
    key.timestamp = Date.now();
    const hasUnspent = key.info.final_balance > 0;
    if (hasUnspent) {
      console.log(
        "Address",
        key.address,
        "has balance",
        key.info.final_balance
      );
    }
    keys.push(key);
    if (keys.length > megaKeys) {
      saveKeys();
      keys = [];
    }
  }
})();
