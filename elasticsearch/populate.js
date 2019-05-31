const {
  bulk,
  recreateIndex
} = require('./client');

const recreateIndices = (sources) => {
  const indicesRecreated = [];

  for (const index of sources.keys()) {
    indicesRecreated.push(recreateIndex(index));
  }

  return Promise.all(indicesRecreated);
};

const loadIndexData = (index, data) => {
  const type = index;

  return bulk(index, type, data);
}

const loadIndicesData = (sources) => {
  const indicesPopulated = [];

  for (const [index, data] of sources) {
    indicesPopulated.push(loadIndexData(index, data));
  }

  return Promise.all(indicesPopulated);
};

module.exports = {
  recreateIndices,
  loadIndicesData
};