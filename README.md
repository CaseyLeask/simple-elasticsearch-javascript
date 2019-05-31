# simple-elasticsearch-javascript

# Installation / Dependencies

## Elasticsearch
```
brew install elasticsearch
```

Follow the instructions for starting elasticsearch specified in homebrew.

## Node
v8.15.0 or later is recommended, as we use `await` syntax.
I recommend https://github.com/nvm-sh/nvm#installation-and-update if you don't have a preferred, already installed Node version manager.

## NPM Dependencies
yarn is the package manager used in this project.
I recommend you follow the instructions https://yarnpkg.com/en/docs/install if you don't have it installed.
Once it's installed, to install your project dependencies, run
```
yarn
```

# Usage
```
yarn start
```

# Troubleshooting
Install Kibana and have a poke around.
```
brew install kibana
brew services start kibana
```

Log files for elasticsearch can found with
```
brew info elasticsearch
```

# Nice extras
Since I didn't have a 'schema', but only what's in the provided files, I decided to make *that* the schema in all cases.
What this means is that if you want to add or remove fields from any of the data files, you can do so, re-run the application and everything will most likely be fine.
I'm exploiting elasticsearch dynamic mappings to do this while still giving fast results to queries.
The exception to this is the relations between the data-sets, since there isn't a way to programmatically link, for example `ticket.submitter_id` to `users`, without establishing that link somewhere.
Since the fields can be dynamic, but known when beginning console interaction, I made the 'Enter Search Term' list be an auto-suggest of available fields, updated on the fly based on user input.

# Shortcomings
We're dropping the indexes and re-creating them every time the application starts.
That's fine for local development, but it's not a thing you should be doing in production.
In the process of implementing every feature in the requirements, I realised that the solution is a combination of ORM and Search.
Currently there's no concept of an ORM in the codebase which leaves the elasticsearch code a bit messy as a result.
Would be interesting to see how close to requirements Rails Activemodel and Elasticsearch::Model could get, for example https://github.com/elastic/elasticsearch-rails/tree/master/elasticsearch-model#relationships-and-associations