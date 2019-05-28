const fs = require('fs');

const {
  ping,
  recreateIndex,
  deleteIndex,
  bulk
} = require('./elasticsearch');

const sources = [
  'users',
  'tickets',
  'organizations'
]

function loadType(type) {
  const index = type;

  const typeFile = fs.readFileSync(`data/${type}.json`);
  const typeJSON = JSON.parse(typeFile);

  return bulk(index, type, typeJSON);
}

(async() => {
  try {
    console.log('Testing elasticsearch connection');
    const healthy = await ping();

    if (healthy) {
      console.log('elasticsearch connection is up');
      console.log('Recreating indices');
      await Promise.all(sources.map(recreateIndex));
      console.log('loading data into indices');
      await Promise.all(sources.map(loadType));
    } else {
      console.error('elasticsearch is not healthy');
    }
  } catch ({message, stack}) {
    console.log(message, stack);
  }
})();