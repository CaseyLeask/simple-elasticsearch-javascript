const { expect } = require('chai');

const data = require('../../data');

describe('data', () => {
  describe('#loadSources', () => {
    describe('with three sources', () => {
      const sourceNames = [
        'organizations',
        'tickets',
        'users'
      ];

      describe('and minimal data', () => {
        const filePath = name => `test/data/minimal/${name}.json`

        it('should have three sources', () => {
          const sources = data.loadSources(sourceNames, filePath);

          expect(sources).to.have.lengthOf(3);
        });

        it('should have the right organizations data', () => {
          const sources = data.loadSources(sourceNames, filePath);
          const organizations = sources.get('organizations');

          // _id should be replaced with id
          expect(organizations).to.deep.equal([
            {
              "id": 101,
              "url": "http://initech.zendesk.com/api/v2/organizations/101.json",
              "external_id": "9270ed79-35eb-4a38-a46f-35725197ea8d",
              "name": "Enthaze",
              "domain_names": [
                "kage.com",
                "ecratic.com",
                "endipin.com",
                "zentix.com"
              ],
              "created_at": "2016-05-21T11:10:28 -10:00",
              "details": "MegaCorp",
              "shared_tickets": false,
              "tags": [
                "Fulton",
                "West",
                "Rodriguez",
                "Farley"
              ]
            },
            {
              "id": 102,
              "url": "http://initech.zendesk.com/api/v2/organizations/102.json",
              "external_id": "7cd6b8d4-2999-4ff2-8cfd-44d05b449226",
              "name": "Nutralab",
              "domain_names": [
                "trollery.com",
                "datagen.com",
                "bluegrain.com",
                "dadabase.com"
              ],
              "created_at": "2016-04-07T08:21:44 -10:00",
              "details": "Non profit",
              "shared_tickets": false,
              "tags": [
                "Cherry",
                "Collier",
                "Fuentes",
                "Trevino"
              ]
            }
          ]);
        });

        it('should have the right tickets data', () => {
          const sources = data.loadSources(sourceNames, filePath);
          const tickets = sources.get('tickets');

          // _id should be replaced with id
          expect(tickets).to.deep.equal([
            {
              "id": "436bf9b0-1147-4c0a-8439-6f79833bff5b",
              "url": "http://initech.zendesk.com/api/v2/tickets/436bf9b0-1147-4c0a-8439-6f79833bff5b.json",
              "external_id": "9210cdc9-4bee-485f-a078-35396cd74063",
              "created_at": "2016-04-28T11:19:34 -10:00",
              "type": "incident",
              "subject": "A Catastrophe in Korea (North)",
              "description": "Nostrud ad sit velit cupidatat laboris ipsum nisi amet laboris ex exercitation amet et proident. Ipsum fugiat aute dolore tempor nostrud velit ipsum.",
              "priority": "high",
              "status": "pending",
              "submitter_id": 38,
              "assignee_id": 24,
              "organization_id": 116,
              "tags": [
                "Ohio",
                "Pennsylvania",
                "American Samoa",
                "Northern Mariana Islands"
              ],
              "has_incidents": false,
              "due_at": "2016-07-31T02:37:50 -10:00",
              "via": "web"
            },
            {
              "id": "1a227508-9f39-427c-8f57-1b72f3fab87c",
              "url": "http://initech.zendesk.com/api/v2/tickets/1a227508-9f39-427c-8f57-1b72f3fab87c.json",
              "external_id": "3e5ca820-cd1f-4a02-a18f-11b18e7bb49a",
              "created_at": "2016-04-14T08:32:31 -10:00",
              "type": "incident",
              "subject": "A Catastrophe in Micronesia",
              "description": "Aliquip excepteur fugiat ex minim ea aute eu labore. Sunt eiusmod esse eu non commodo est veniam consequat.",
              "priority": "low",
              "status": "hold",
              "submitter_id": 71,
              "assignee_id": 38,
              "organization_id": 112,
              "tags": [
                "Puerto Rico",
                "Idaho",
                "Oklahoma",
                "Louisiana"
              ],
              "has_incidents": false,
              "due_at": "2016-08-15T05:37:32 -10:00",
              "via": "chat"
            }
          ]);
        });

        it('should have the right users data', () => {
          const sources = data.loadSources(sourceNames, filePath);
          const users = sources.get('users');

          expect(users).to.deep.equal([
            {
              "id": 1,
              "url": "http://initech.zendesk.com/api/v2/users/1.json",
              "external_id": "74341f74-9c79-49d5-9611-87ef9b6eb75f",
              "name": "Francisca Rasmussen",
              "alias": "Miss Coffey",
              "created_at": "2016-04-15T05:19:46 -10:00",
              "active": true,
              "verified": true,
              "shared": false,
              "locale": "en-AU",
              "timezone": "Sri Lanka",
              "last_login_at": "2013-08-04T01:03:27 -10:00",
              "email": "coffeyrasmussen@flotonic.com",
              "phone": "8335-422-718",
              "signature": "Don't Worry Be Happy!",
              "organization_id": 119,
              "tags": [
                "Springville",
                "Sutton",
                "Hartsville/Hartley",
                "Diaperville"
              ],
              "suspended": true,
              "role": "admin"
            },
            {
              "id": 2,
              "url": "http://initech.zendesk.com/api/v2/users/2.json",
              "external_id": "c9995ea4-ff72-46e0-ab77-dfe0ae1ef6c2",
              "name": "Cross Barlow",
              "alias": "Miss Joni",
              "created_at": "2016-06-23T10:31:39 -10:00",
              "active": true,
              "verified": true,
              "shared": false,
              "locale": "zh-CN",
              "timezone": "Armenia",
              "last_login_at": "2012-04-12T04:03:28 -10:00",
              "email": "jonibarlow@flotonic.com",
              "phone": "9575-552-585",
              "signature": "Don't Worry Be Happy!",
              "organization_id": 106,
              "tags": [
                "Foxworth",
                "Woodlands",
                "Herlong",
                "Henrietta"
              ],
              "suspended": false,
              "role": "admin"
            }
          ]);
        });
      });
    });
  });
});


