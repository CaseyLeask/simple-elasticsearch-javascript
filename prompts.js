const prompts = require('prompts');

const choiceInput = async(choices, message = '') => {
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
  choiceInput,
  textInput
}