const fs = require('fs');

const sources = [
  'users',
  'tickets',
  'organizations'
]

function loadFile(source) {
  const fileContents = fs.readFileSync(`data/${source}.json`);

  return JSON.parse(fileContents);
}

module.exports = {
  sources,
  loadFile
}