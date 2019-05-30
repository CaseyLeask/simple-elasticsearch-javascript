const prompts = require('prompts');
const elasticsearch = require('../elasticsearch');

const begin = () => {
  welcome();
};

const welcome = async() => {
  const sourceAnswers = await prompts([
    {
      type: 'text',
      name: 'welcome',
      message: "Welcome to Zendesk Search\nType 'quit' to exit at any time, Press 'Enter' to continue\n"
    },
    {
      type: 'text',
      name: 'searchOptions',
      message: "Select search options:\nPress 1 to search Zendesk\nPress 2 to view a list of searchable fields\nType 'quit' to exit\n",
      validate: choice => ['1', '2', 'quit'].indexOf(choice) >= 0
    }
  ], { onSubmit });

  if (sourceAnswers.quit) {
    process.exit();
  }

  if (sourceAnswers.searchOptions == '1') {
    searchZendesk();
  }

  if (sourceAnswers.searchOptions == '2') {
    const sources = await elasticsearch.getSearchableFields([
      'organizations',
      'tickets',
      'users'
    ]);

    Object.keys(sources).forEach(source => {
      const sourceCapitalized = source.charAt(0).toUpperCase() + source.slice(1);

      console.log('-------------------------------------------------------------------------------');
      console.log(`Search ${sourceCapitalized} with`);
      sources[source].forEach(field => console.log(field));
      console.log('');
    });

    return;
  }
};

const searchZendesk = async() => {
  const sourceAnswers = await prompts([
    {
      type: 'text',
      name: 'selectSource',
      message: "Select 1) Users or 2) Tickets or 3) Organizations\n",
      validate: choice => ['1', '2', '3', 'quit'].indexOf(choice) >= 0
    }
  ], { onSubmit });

  if (sourceAnswers.quit) {
    process.exit();
  }

  let source = {
    1: 'users',
    2: 'tickets',
    3: 'organizations'
  }[sourceAnswers.selectSource];

  const {[source]: terms} = await elasticsearch.getSearchableFields([source])
  const menu = terms.map(c => ({ title: c }));
  menu.push({title: 'quit'});

  const searchAnswers = await prompts([
    {
      type: 'autocomplete',
      name: 'term',
      message: "Enter search term",
      choices: menu,
      limit: 30
    },
    {
      type: 'text',
      name: 'value',
      message: "Enter search value",
      limit: 30
    }
  ], { onSubmit });

  if (searchAnswers.quit) {
    process.exit();
  }

  try {
    const results = await elasticsearch.getSearch(source, searchAnswers.term, searchAnswers.value);

    if (results.length > 0) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log('No results found');
    }
  } catch ({message}) {
    console.log(`error connecting to elasticsearch: ${message}`);
  }
}

const onSubmit = (_prompt, response, answers) => {
  if (response == 'quit') {
    answers.quit = true;
    return true;
  }

  if (answers.searchOptions == '2') {
    return true;
  }
};

module.exports = {
  begin
};