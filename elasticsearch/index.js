const {
  ping,
  indices,
  bulk,
  recreateIndex,
  search
} = require('./client');
const searchData = require('./searchData');

function loadIndexData(source) {
  const sourceJSON = searchData.loadFile(source);

  const index = source;
  const type  = index;

  return bulk(index, type, sourceJSON);
}

const populate = async() => {
  console.log('Testing elasticsearch connection');
  await ping();
  console.log('elasticsearch connection is up');

  console.log('Recreating indices');
  await Promise.all(searchData.sources.map(recreateIndex));

  console.log('loading data into indices');
  await Promise.all(searchData.sources.map(loadIndexData));
  console.log('data has loaded');
};

const getSearchableFields = async(sources = searchData.sources) => {
  const indicesData = await indices(sources);

  const flattenedData = {};

  sources.forEach(s => {
    flattenedData[s] = ['_id'];
    flattenedData[s] = flattenedData[s].concat(Object.keys(indicesData[s]['mappings'][s]['properties']));
  });

  return flattenedData;
};

const getSearch = async(source, term, value) => {
  if (term == '_id' && value == '') {
    return []; // This cannot return a value, but program needs to accept empty values
  }

  const { hits: { hits }} = await search(source, term, value);

  const flattenedResults = hits.map(hit => hit['_source']);
  return flattenedResults;
};

module.exports = {
  populate,
  getSearchableFields,
  getSearch
}