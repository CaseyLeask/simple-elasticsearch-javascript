const elasticsearch = require('./elasticsearch');
const consoleInteraction = require('./consoleInteraction');

async function main() {
  try {
    await elasticsearch.populate();
  } catch ({message, stack}) {
    console.log(message, stack);
    return;
  }

  consoleInteraction.begin();
}

main();