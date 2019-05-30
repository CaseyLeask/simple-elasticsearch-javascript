const { expect } = require('chai');
const sinon = require('sinon');

const prompts = require('prompts');

const consoleInteraction = require('../../consoleInteraction');

describe('consoleInteraction', () => {
  describe('in the welcome page', () => {
    describe("entering 'quit'", () => {
      const commands = ['quit'];

      it('should quit', async() => {
        prompts.inject(commands);
        let lastLog;
        const logger = {
          log: line => lastLog = line
        };

        await consoleInteraction.begin(logger);

        expect(lastLog).to.equal('Quitting...');
      });
    });
  });

  describe('in search options', () => {
    describe("entering 'quit'", () => {
      const commands = ['', 'quit'];
      it('should quit', async() => {
        prompts.inject(commands);
        let lastLog;
        const logger = {
          log: line => lastLog = line
        }

        await consoleInteraction.begin(logger);

        expect(lastLog).to.equal('Quitting...');
      });
    });
  });

  describe('after selecting search', () => {
    describe('in selecting a source', () => {
      describe("entering 'quit'", () => {
        const commands = ['', '1', 'quit'];

        it('should quit', async() => {
          prompts.inject(commands);
          let lastLog;
          const logger = {
            log: line => lastLog = line
          };

          await consoleInteraction.begin(logger);

          expect(lastLog).to.equal('Quitting...');
        });
      });
    });

    describe('after selecting users source', () => {
      const source = 1;
      describe('in selecting a search term', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      });

      describe('in selecting a search value', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'id', 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      })
    })

    describe('after selecting tickets source', () => {
      const source = '2';

      describe('in selecting a search term', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      });

      describe('in selecting a search value', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'id', 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      })
    })

    describe('after selecting organization source', () => {
      const source = '3';

      describe('in selecting a search term', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      });

      describe('in selecting a search value', () => {
        describe("entering 'quit'", () => {
          const commands = ['', '1', source, 'id', 'quit'];

          it('should quit', async() => {
            prompts.inject(commands);
            let lastLog;
            const logger = {
              log: line => lastLog = line
            };

            await consoleInteraction.begin(logger);

            expect(lastLog).to.equal('Quitting...');
          });
        });
      })
    })
  });

});