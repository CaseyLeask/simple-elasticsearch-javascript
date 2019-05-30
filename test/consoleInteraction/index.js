const { expect } = require('chai');
const sinon = require('sinon');

const prompts = require('prompts');

const data = require('../../data');
const elasticsearch = require('../../elasticsearch');

const sleep = (ms) => new Promise(resolve => { setTimeout(resolve, ms)});

const consoleInteraction = require('../../consoleInteraction');

describe('consoleInteraction', () => {
  describe('with a related data set', () => {
    before(async function() {
      this.timeout(5000);

      const sourceNames = [
        'organizations',
        'tickets',
        'users'
      ];
      const filePath = name => `test/data/related/${name}.json`;
      const sources = data.loadSources(sourceNames, filePath);

      await elasticsearch.populate(sources);
      await sleep(2000);
    });

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

          describe('entering a value with no matches', () => {
            const commands = ['', '1', source, 'id', '5555'];

            it('should return no results', async() => {
              prompts.inject(commands);
              let lastLog;
              const logger = {
                log: line => lastLog = line
              };

              await consoleInteraction.begin(logger);

              expect(lastLog).to.equal('No results found');
            });
          });

          describe('entering a value with matches', () => {
            const commands = ['', '1', source, 'id', '1'];

            it('should return results', async() => {
              prompts.inject(commands);
              let lines = [];
              const logger = {
                log: line => lines.push(line)
              };

              await consoleInteraction.begin(logger);

              const jsonResult = JSON.parse(lines.join("\n"));

              expect(jsonResult).to.have.lengthOf(1);
              expect(jsonResult[0].name).to.equal('Francisca Rasmussen');
              expect(jsonResult[0].relatedTickets).to.have.lengthOf(1);
              expect(jsonResult[0].relatedTickets[0].subject).to.equal('A Catastrophe in Korea (North)');
              expect(jsonResult[0].organization.name).to.equal('Nutralab');
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

          describe('entering a value with no matches', () => {
            const commands = ['', '1', source, 'id', '5555'];

            it('should return no results', async() => {
              prompts.inject(commands);
              let lastLog;
              const logger = {
                log: line => lastLog = line
              };

              await consoleInteraction.begin(logger);

              expect(lastLog).to.equal('No results found');
            });
          });

          describe('entering a value with matches', () => {
            const commands = ['', '1', source, 'id', '436bf9b0-1147-4c0a-8439-6f79833bff5b'];

            it('should return results', async() => {
              prompts.inject(commands);
              let lines = [];
              const logger = {
                log: line => lines.push(line)
              };

              await consoleInteraction.begin(logger);

              const jsonResult = JSON.parse(lines.join("\n"));

              expect(jsonResult).to.have.lengthOf(1);
              expect(jsonResult[0].subject).to.equal('A Catastrophe in Korea (North)');
              expect(jsonResult[0].submitterUser.name).to.equal('Francisca Rasmussen');
              expect(jsonResult[0].assigneeUser.name).to.equal('Cross Barlow');
              expect(jsonResult[0].organization.name).to.equal('Nutralab');
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
        });
        })

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

          describe('entering a value with no matches', () => {
            const commands = ['', '1', source, 'id', '5555'];

            it('should return no results', async() => {
              prompts.inject(commands);
              let lastLog;
              const logger = {
                log: line => lastLog = line
              };

              await consoleInteraction.begin(logger);

              expect(lastLog).to.equal('No results found');
            });
          });

          describe('entering a value with matches', () => {
            const commands = ['', '1', source, 'id', '102'];

            it('should return results', async() => {
              prompts.inject(commands);
              let lines = [];
              const logger = {
                log: line => lines.push(line)
              };

              await consoleInteraction.begin(logger);

              const jsonResult = JSON.parse(lines.join("\n"));

              expect(jsonResult).to.have.lengthOf(1);
              expect(jsonResult[0].name).to.equal('Nutralab');
              expect(jsonResult[0].relatedTickets).to.have.lengthOf(1);
              expect(jsonResult[0].relatedTickets[0].subject).to.equal('A Catastrophe in Korea (North)');
              expect(jsonResult[0].relatedUsers).to.have.lengthOf(1);
              expect(jsonResult[0].relatedUsers[0].name).to.equal('Francisca Rasmussen');
            });
          });
        })
      })
    });

    describe('in selecting view searchable fields', () => {
      const commands = ['', '2'];

      it('should display searchable fields', async() => {
        prompts.inject(commands);
        let lines = [];
        const logger = {
          log: line => lines.push(line)
        };

        await consoleInteraction.begin(logger);

        const formattedLines = lines.reduce((acc, line) => acc.concat(line.split("\n")), [])
                                    .map(line => line.trim());

        expect(formattedLines).to.deep.equal([
          "-------------------------------------------------------------------------------",
          "Search Organizations with",
          "created_at",
          "details",
          "domain_names",
          "external_id",
          "id",
          "name",
          "shared_tickets",
          "tags",
          "url",
          "",
          "-------------------------------------------------------------------------------",
          "Search Tickets with",
          "assignee_id",
          "created_at",
          "description",
          "due_at",
          "external_id",
          "has_incidents",
          "id",
          "organization_id",
          "priority",
          "status",
          "subject",
          "submitter_id",
          "tags",
          "type",
          "url",
          "via",
          "",
          "-------------------------------------------------------------------------------",
          "Search Users with",
          "active",
          "alias",
          "created_at",
          "email",
          "external_id",
          "id",
          "last_login_at",
          "locale",
          "name",
          "organization_id",
          "phone",
          "role",
          "shared",
          "signature",
          "suspended",
          "tags",
          "timezone",
          "url",
          "verified",
          ""
        ]);
      });
    })
  })
});
