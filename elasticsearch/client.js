const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error',
  maxRetries: 3,
  requestTimeout: 5000
});

function ping() {
  return client.ping();
}

function indices(indices) {
  return client.indices.get({index: indices});
}

function createIndex(index) {
  return client.indices.create({index});
}

function deleteIndex(index) {
  return client.indices.delete({index});
}

function ignoreMissingIndexes(error) {
  if (error.statusCode == 404) {
    return;
  }

  throw error;
}

function recreateIndex(index) {
  return deleteIndex(index).catch(ignoreMissingIndexes)
                           .then(() => createIndex(index));
}

function bulk(index, type, data) {
  let body = [];

  data.forEach(item => {
    body.push({
      index: {
        _index: index,
        _type: type,
        _id: item._id
      }
    });

    delete item._id;
    body.push(item);
  });

  return client.bulk({body});
}

function searchOneTerm(index, term, value) {
  const query = {
    "query": {
      "match" : {
        [term] : value
      }
    }
  };

  return client.search({
    index,
    body: query,
    pretty: true
  });
}

function searchMultipleTerms(index, terms, value) {
  const shouldQuery = terms.map(t => ({terms: {[t]: value}}))
  const query = {
    "query": {
      "bool": {
        "should": shouldQuery
      }
    }
  };

  return client.search({
    index,
    body: query,
    pretty: true
  });
}

module.exports = {
  ping,
  indices,
  createIndex,
  deleteIndex,
  recreateIndex,
  searchOneTerm,
  searchMultipleTerms,
  bulk
};