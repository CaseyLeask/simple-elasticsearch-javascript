const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

async function ping(client) {
  try {
    const response = await client.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 1000
    });
    console.log('All is well');
    console.log(response);
  } catch (error) {
    console.trace('elasticsearch cluster is down!');
    console.trace(error.message);
  }
}

ping(client);