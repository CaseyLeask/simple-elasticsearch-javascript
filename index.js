const data = require('./data');
const elasticsearch = require('./elasticsearch');
const consoleInteraction = require('./consoleInteraction');

async function main() {
  try {
    await elasticsearch.populate(data.loadSources());
  } catch ({message}) {
    console.log("Experienced an error populating elasticsearch");
    console.log(message);
    return;
  }

  try {
    await consoleInteraction.begin();
  } catch ({message}) {
    console.log("Experienced an error in making the search");
    console.log(message);
    return;
  }
}

main();