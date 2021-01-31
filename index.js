const fs = require("fs");
const path = require("path");
const request = require("./request");

async function getNewKeyPairs() {
  const { address, publicKey, privateKey } = await request.generateKeyPairs();
  return { address, publicKey, privateKey };
}

(async function () {
  while (true) {
    const timestamp = Date.now();
    const hour = Math.floor(timestamp / 1000 / 60 / 60);
    const folderPath = path.join(__dirname, "data", hour.toString());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    let key = await getNewKeyPairs();
    const info = await request.getAddressInfo(key.address);
    key.info = info.data;
    key.timestamp = timestamp;
    const empty = key.info.n_tx === 0;
    const unspent = !empty && key.info.final_balance > 0;
    const spent = !empty && key.info.final_balance === 0;
    if (hasBalance) {
      console.log(
        "Address",
        key.address,
        "has balance",
        key.info.final_balance
      );
    }
    fs.writeFileSync(
      path.join(
        folderPath,
        key.address + (unspent ? ".unspent" : spent ? ".spent" : ".empty")
      ),
      JSON.stringify(key),
      { encoding: "utf8" }
    );
  }
})();
