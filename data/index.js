const fs = require('fs');

const sourceNames = [
  'users',
  'tickets',
  'organizations'
]

const defaultPath = name => `data/${name}.json`;

const loadFile = (path) => {
  const fileContents = fs.readFileSync(path);
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

const loadSources = (files = sourceNames, filePath = defaultPath) => {
  const sources = new Map();

  files.forEach(source  => {
    sources.set(source, loadFile(filePath(source)));
  });

  return sources;
}

module.exports = {
  sourceNames,
  loadSources
}