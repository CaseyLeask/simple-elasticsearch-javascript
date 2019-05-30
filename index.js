const data = require('./data');
const elasticsearch = require('./elasticsearch');
const consoleInteraction = require('./consoleInteraction');

async function main() {
  try {
    const sources = data.loadSources();
    await elasticsearch.populate(sources);
    process.exit();
  } catch ({message, stack}) {
    console.log(message, stack);
    return;
  }

  consoleInteraction.begin();
}

main();