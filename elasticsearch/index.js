const {
  ping,
  indices,
  bulk,
  recreateIndex,
  searchOneTerm,
  searchMultipleTerms
} = require('./client');
const searchData = require('./searchData');

function loadIndexData(source) {
  const sourceJSON = searchData.loadFile(source);

  const index = source;
  const type  = index;

  return bulk(index, type, sourceJSON);
}

const populate = async() => {
  console.log('Testing elasticsearch connection');
  await ping();
  console.log('elasticsearch connection is up');

  console.log('Recreating indices');
  await Promise.all(searchData.sources.map(recreateIndex));

  console.log('loading data into indices');
  await Promise.all(searchData.sources.map(loadIndexData));
  console.log('data has loaded');
};

const getSearchableFields = async(sources = searchData.sources) => {
  const indicesData = await indices(sources);

  const flattenedData = {};

  sources.forEach(s => {
    flattenedData[s] = ['_id'];
    flattenedData[s] = flattenedData[s].concat(Object.keys(indicesData[s]['mappings'][s]['properties']));
  });

  return flattenedData;
};

const getSearch = async(source, term, value) => {
  if (term == '_id' && value == '') {
    return []; // This cannot return a value, but program needs to accept empty values
  }

  const { hits: { hits }} = await searchOneTerm(source, term, value);

  const flattenedResults = hits.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));

  if (source == 'organizations') {
    const organizationIds = flattenedResults.map(u => u['_id']);
    const { hits: { hits: tickets }} = await searchMultipleTerms('tickets', ['organization_id'], organizationIds);

    const flattenedTickets = tickets.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));

    flattenedResults.forEach(organization => {
      const relatedTickets = flattenedTickets.filter(ticket => {
        return ticket['organization_id'] == organization['_id'];
      });
      organization.relatedTickets = relatedTickets;
    });

    const { hits: { hits: users }} = await searchMultipleTerms('users', ['organization_id'], organizationIds);

    const flattenedUsers = users.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));

    flattenedResults.forEach(organization => {
      const relatedUsers = flattenedUsers.filter(user => {
        return user['organization_id'] == organization['_id'];
      });
      organization.relatedUsers = relatedUsers;
    });
  } else if (source == 'tickets') {
    const organizationIds = flattenedResults.map(t => t['organization_id'])
                                            .filter(t => t != null);

    const { hits: { hits: organizations }} = await searchMultipleTerms('organizations', ['_id'], organizationIds);

    const flattenedOrganizations = organizations.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));
    flattenedResults.forEach(ticket => {
      const relatedOrganization = flattenedOrganizations.filter(organization => {
        return organization['_id'] == ticket['organization_id'];
      })[0];
      ticket.organization = relatedOrganization;
    });

    const submitterIds = flattenedResults.map(t => t['submitter_id']);
    const assigneeIds = flattenedResults.map(t => t['assignee_id'])
                                        .filter(t => t != null);
    const userIds = submitterIds.concat(assigneeIds);
    const { hits: { hits: users }} = await searchMultipleTerms('users', ['_id'], userIds);

    const flattenedUsers = users.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));
    flattenedResults.forEach(ticket => {
      const relatedSubmitterUser = flattenedUsers.filter(user => {
        return user['_id'] == ticket['submitter_id'];
      })[0];
      ticket.submitterUser = relatedSubmitterUser;

      const relatedAssigneeUser = flattenedUsers.filter(user => {
        return user['_id'] == ticket['assignee_id'];
      })[0];
      ticket.assigneeUser = relatedAssigneeUser;
    });
  } else if (source == 'users') {
    const userIds = flattenedResults.map(u => u['_id']);
    const relatedTicketFields = ['submitter_id', 'assignee_id'];
    const { hits: { hits: tickets }} = await searchMultipleTerms('tickets', relatedTicketFields, userIds);

    const flattenedTickets = tickets.map(hit => Object.assign(hit['_source'], {'_id': hit['_id']}));

    flattenedResults.forEach(user => {
      const relatedTickets = flattenedTickets.filter(ticket => {
        return relatedTicketFields.some(field => ticket[field] == user['_id']);
      });
      user.relatedTickets = relatedTickets;
    });
  }

  return flattenedResults;
};

module.exports = {
  populate,
  getSearchableFields,
  getSearch
}