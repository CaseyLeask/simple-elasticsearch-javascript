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

      describe("with a search term of 'organization_id'", () => {
        const searchTerm = 'organization_id';

        describe("and a search value of ''", () => {
          const searchValue = '';

          it("should return only the 'Cross Barlow' user", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual).to.have.lengthOf(1);
            expect(actual[0].name).to.equal('Cross Barlow');
          });
        });
      });
    });

    describe('when retrieving searchable fields', () => {
      it('should return all searchable fields', async() => {
        const actual = await elasticsearch.getSearchableFields([
          'organizations',
          'tickets',
          'users'
        ]);

        expect(actual).to.deep.equal(
          {
            organizations: [
              'created_at',
              'details',
              'domain_names',
              'external_id',
              'id',
              'name',
              'shared_tickets',
              'tags',
              'url'
            ],
            tickets: [
              'assignee_id',
              'created_at',
              'description',
              'due_at',
              'external_id',
              'has_incidents',
              'id',
              'organization_id',
              'priority',
              'status',
              'subject',
              'submitter_id',
              'tags',
              'type',
              'url',
              'via'
            ],
            users: [
              'active',
              'alias',
              'created_at',
              'email',
              'external_id',
              'id',
              'last_login_at',
              'locale',
              'name',
              'organization_id',
              'phone',
              'role',
              'shared',
              'signature',
              'suspended',
              'tags',
              'timezone',
              'url',
              'verified'
            ]
          }
        );
      });
    });
  });

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

    describe('when searching organizations', () => {
      const source = 'organizations';

      describe("with a search term of 'shared_tickets'", () => {
        const searchTerm = 'shared_tickets';

        describe("and a search value of 'false'", () => {
          const searchValue = 'false';

          it("should return only the 'Nutralab' organization", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual).to.have.lengthOf(1);
            expect(actual[0].name).to.equal('Nutralab');
          });

          it("should have only 'A Catastrophe in Korea (North)' as a related ticket", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].relatedTickets).to.have.lengthOf(1);
            expect(actual[0].relatedTickets[0].subject).to.equal('A Catastrophe in Korea (North)');
          });

          it("should have only 'Francisca Rasmussen' as a related user", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].relatedUsers).to.have.lengthOf(1);
            expect(actual[0].relatedUsers[0].name).to.equal('Francisca Rasmussen');
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

          it("should have only 'Francisca Rasmussen' as a submitter", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].submitterUser.name).to.equal('Francisca Rasmussen');
          });

          it("should have only 'Cross Barlow' as an assignee", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].assigneeUser.name).to.equal('Cross Barlow');
          });

          it("should have only 'Nutralab' as a related organization", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].organization.name).to.equal('Nutralab');
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

          it("should have only 'A Catastrophe in Korea (North)' as a related ticket", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].relatedTickets).to.have.lengthOf(1);
            expect(actual[0].relatedTickets[0].subject).to.equal('A Catastrophe in Korea (North)');
          });

          it("should have only 'Nutralab' as a related organization", async() => {
            const actual = await elasticsearch.getSearch(source, searchTerm, searchValue);

            expect(actual[0].organization.name).to.equal('Nutralab');
          });
        });
      });
    });
  });
});