const chalk = require("chalk");
const keys = require("./3000key.json");
const getAddressInfo = require("./getAddressInfo");

(async function () {
  for (const key of keys) {
    const address = key.a;
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
})();
