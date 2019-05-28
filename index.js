const elasticsearch = require('elasticsearch');

const elasticsearchClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

elasticsearchClient.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});