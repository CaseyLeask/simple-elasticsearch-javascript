const {
  ping,
  indices,
  bulk,
  recreateIndex
} = require('./client');

const {
  recreateIndices,
  loadIndicesData
} = require('./populate');

const search = require('./search');

const populate = async(sources) => {
  console.log('Testing elasticsearch connection');
  await ping();
  console.log('elasticsearch connection is up');
  console.log('...');
  console.log('Recreating indices');
  await recreateIndices(sources);
  console.log('indices have been recreated');
  console.log('...');
  console.log('loading data into indices');
  await loadIndicesData(sources);
  console.log('data has loaded');
  console.log('...');
};

const getSearchableFields = search.getSearchableFields;

const getSearch = search.getSearch;

module.exports = {
  populate,
  getSearchableFields,
  getSearch
}