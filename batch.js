const fs = require("fs");
const path = require("path");

const keys = [];

const dataFolder = path.join(__dirname, "data");

function saveKeys() {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
  fs.writeFileSync(
    path.join(dataFolder, Date.now().toString() + ".json"),
    JSON.stringify(keys, null, 2),
    { encoding: "utf8" }
  );
}

function loadKeys() {
  const subDir = path.join(dataFolder, "351381");
  fs.readdirSync(subDir).forEach((file) => {
    console.log(file);
    keys.push(
      JSON.parse(
        fs.readFileSync(path.join(subDir, file), { encoding: "utf8" })
      )
    );
  });
}

loadKeys();
saveKeys();
