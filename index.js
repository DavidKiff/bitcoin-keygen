const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const axios = require("axios");
const bitcoin = require("bitcoinjs-lib");
const { pseudoRandomBytes } = require("crypto");
const getAddressInfo = require("./getAddressInfo");

function getNewKeyPairs() {
  // const keyPair = bitcoin.ECPair.makeRandom({ rng: pseudoRandomBytes });
  const keyPair = bitcoin.ECPair.makeRandom();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  // const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });
  const publicKey = keyPair.publicKey.toString("hex");
  const privateKey = keyPair.toWIF();
  return { address, privateKey, publicKey };
}

const keysPerFile = 50000;

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

process.on("SIGHUP", function () {
  saveKeys();
  process.exit();
});

(async function () {
  while (true) {
    let key = getNewKeyPairs();
    const info = await getAddressInfo(key.address);
    if (info) {
      key.info = info.data;
      key.timestamp = Date.now();
      const empty = key.info.n_tx === 0;
      const spent = key.info.final_balance === 0;
      // if (!empty) {
      //   console.log(
      //     key.address,
      //     chalk.green("has balance " + key.info.final_balance)
      //   );
      // }
      console.log(
        key.address,
        empty
          ? chalk.red("is empty")
          : spent
          ? chalk.yellow("is spent")
          : chalk.green("has balance " + key.info.final_balance)
      );
      keys.push(key);
      if (keys.length > keysPerFile) {
        saveKeys();
        keys = [];
      }
    }
  }
})();
