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

# Shortcomings
We're dropping the indexes and re-creating them every time the application starts.
That's fine for local development, but it's not a thing you should be doing in production.
This code is real messy, and lacks a proper test suite. This code was done in the style of a 'spike', a polite way of saying 'hack day code, not for long term maintenance'.
In the process of implementing every feature in the requirements, I realised that the solution is a combination of ORM and Search.