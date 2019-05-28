const prompts = require('prompts');
const elasticsearch = require('./elasticsearch');

const begin = () => {
  welcome();
};

const welcome = async() => {
  console.log('Welcome to Zendesk Search');
  console.log("Type 'quit' to exit at any time, Press 'Enter' to continue");

  await textInput();

  viewOrSearch();
};

const viewOrSearch = async() => {
  console.log('Select search options:');
  console.log('Press 1 to search Zendesk');
  console.log('Press 2 to view a list of searchable fields');
  console.log("Type 'quit' to exit");

  const choice = await textInput();

  switch (choice) {
    case '1':
      chooseSource();
      break;
    case '2':
      viewSearchableFields();
      break;
    default:
      console.log(`Unrecognised command: '${choice}'`);
      viewOrSearch();
  }
};

const chooseSource = async() => {
  console.log("Select 1) Users or 2) Tickets or 3) Organizations");
  const choice = await textInput();
  let source;

  switch (choice) {
    case '1':
      source = 'users';
      break;
    case '2':
      source = 'tickets';
      break;
    case '3':
      source = 'organizations';
      break;
    default:
      console.log(`Unrecognised choice: '${choice}'`);
      await chooseSource();
  }

  console.log(source);
  enterSearchTerm(source);
};

const enterSearchTerm = async(source) => {
  const {[source]: terms} = await elasticsearch.getSearchableFields([source])

  const term = await choiceInput(terms, 'Enter search term');

  enterSearchValue(source, term);
};

const enterSearchValue = async(source, term) => {
  const value = await textInput('Enter search value');

  const results = await elasticsearch.getSearch(source, term, value);

  if (results.length > 0) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('No results found');
  }
};

const viewSearchableFields = async() => {
  const sources = await elasticsearch.getSearchableFields();

  Object.keys(sources).forEach(source => {
    const sourceCapitalized = source.charAt(0).toUpperCase() + source.slice(1);

    console.log('-------------------------------------------------------------------------------');
    console.log(`Search ${sourceCapitalized} with`);
    sources[source].forEach(field => console.log(field));
    console.log('');
  })
};

const choiceInput = async(choices, message) => {
  const menu = choices.map(c => ({ title: c }));
  menu.push({title: 'quit'});

  const { choice } = await prompts({
    type: 'autocomplete',
    name: 'choice',
    message: message,
    choices: menu,
    limit: 30
  });

  if (choice == 'quit') {
    process.exit();
  }

  return choice;
};

const textInput = async(message = '') => {
  const { choice } = await prompts({
    type: 'text',
    name: 'choice',
    message: message
  });

  if (choice == 'quit') {
    process.exit();
  }

  return choice;
};

module.exports = {
  begin
};