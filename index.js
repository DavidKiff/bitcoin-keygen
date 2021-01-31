const fs = require("fs");
const path = require("path");
const request = require("./request");

async function getNewKeyPairs() {
  const { address, publicKey, privateKey } = await request.generateKeyPairs();
  return { address, publicKey, privateKey };
}

const MB = 1024 * 1024;
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
    const timestamp = Date.now();
    let key = await getNewKeyPairs();
    const info = await request.getAddressInfo(key.address);
    key.info = info.data;
    key.timestamp = timestamp;
    const empty = key.info.n_tx === 0;
    const unspent = !empty && key.info.final_balance > 0;
    const spent = !empty && key.info.final_balance === 0;
    if (unspent) {
      console.log(
        "Address",
        key.address,
        "has balance",
        key.info.final_balance
      );
    }
    keys.push(key);

    if (keys.length > MB) {
      saveKeys();
      keys = [];
    }
  }
})();
