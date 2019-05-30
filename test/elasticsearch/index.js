const { expect } = require('chai');

const data = require('../../data');
const elasticsearch = require('../../elasticsearch');

const sleep = (ms) => new Promise(resolve => { setTimeout(resolve, ms)});

describe('elasticsearch', () => {
  describe('with a minimal data set', () => {
    before(async function() {
      this.timeout(5000);

      const sourceNames = [
        'organizations',
        'tickets',
        'users'
      ];
      const filePath = name => `test/data/minimal/${name}.json`;
      const sources = data.loadSources(sourceNames, filePath);

      await elasticsearch.populate(sources);
      await sleep(2000);
    });

    describe('when searching organizations', () => {
      const source = 'organizations';

      describe("with a search term of 'id'", () => {
        const searchTerm = 'id';

        describe("and a search value of '101'", () => {
          const searchValue = '101';

          it("should return only the 'Enthaze' organization", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual).to.have.lengthOf(1);
            expect(actual[0].name).to.equal('Enthaze');
          });
        });
      });
    });

    describe('when searching tickets', () => {
      const source = 'tickets';

      describe("with a search term of 'priority'", () => {
        const searchTerm = 'priority';

        describe("and a search value of 'high'", () => {
          const searchValue = 'high';

          it("should return only the 'A Catastrophe in Korea (North)' ticket", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual).to.have.lengthOf(1);
            expect(actual[0].subject).to.equal('A Catastrophe in Korea (North)');
          });
        });
      });
    });

    describe('when searching users', () => {
      const source = 'users';

      describe("with a search term of 'suspended'", () => {
        const searchTerm = 'suspended';

        describe("and a search value of 'true'", () => {
          const searchValue = 'true';

          it("should return only the 'Francisca Rasmussen' user", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual).to.have.lengthOf(1);
            expect(actual[0].name).to.equal('Francisca Rasmussen');
          });
        });
      });
    });
  });
});