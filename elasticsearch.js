const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

function ping() {
  return client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  });
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

module.exports = {
  ping,
  createIndex,
  deleteIndex,
  recreateIndex,
  bulk
};