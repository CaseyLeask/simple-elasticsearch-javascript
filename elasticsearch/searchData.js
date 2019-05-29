const fs = require('fs');

const sources = [
  'users',
  'tickets',
  'organizations'
]

function loadFile(source) {
  const fileContents = fs.readFileSync(`data/${source}.json`);
  const fileJSON = JSON.parse(fileContents)

  fileJSON.forEach(entry => {
    // _id has special meaning in elasticsearch and this reduces complications
    if (entry['_id']) {
      entry['id'] = entry['_id'];
      delete entry['_id'];
    }
  })

  return fileJSON;
}

module.exports = {
  sources,
  loadFile
}