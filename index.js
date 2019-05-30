const data = require('./data');
const elasticsearch = require('./elasticsearch');
const consoleInteraction = require('./consoleInteraction');

async function main() {
  try {
    await elasticsearch.populate(data.loadSources());
    process.exit();
  } catch ({message, stack}) {
    console.log(message, stack);
    return;
  }

  consoleInteraction.begin();
}

main();