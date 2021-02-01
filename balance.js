const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "data");

function loadKeys() {
  fs.readdirSync(dataFolder).forEach((file) => {
    console.log(file);
    if (file.endsWith(".json")) {
      const keys = JSON.parse(
        fs.readFileSync(path.join(dataFolder, file), { encoding: "utf8" })
      );
      keys.filter((k) => k.info.n_tx > 0).map(console.log);
    }
  });
}

loadKeys();
