const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const getAddressInfo = require("./getAddressInfo");

(async function () {
  const dataFolder = path.join(__dirname, "data");
  const files = fs.readdirSync(dataFolder);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const keys = JSON.parse(
        fs.readFileSync(path.join(dataFolder, file), { encoding: "utf8" })
      );
      for (const key of keys) {
        const address = key.address;
        const info = await getAddressInfo(address);
        if (info) {
          const empty = info.data.n_tx === 0;
          const spent = info.data.final_balance === 0;
          console.log(
            address,
            empty
              ? chalk.red("is empty")
              : spent
              ? chalk.yellow("is spent")
              : chalk.green("has balance " + info.data.final_balance)
          );
        }
      }
    }
  }
})();
