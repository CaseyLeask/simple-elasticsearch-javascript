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
    flattenedData[s] = Object.keys(indicesData[s]['mappings'][s]['properties']);
  });

  return flattenedData;
};

const getSearch = async(source, term, value) => {
  const { hits: { hits }} = await searchOneTerm(source, term, value);
  const results = hits.map(hit => hit['_source']);

  if (source == 'organizations') {
    return enrichOrganizationsSearch(results);
  } else if (source == 'tickets') {
    return enrichTicketsSearch(results);
  } else if (source == 'users') {
    return enrichUsersSearch(results);
  } else {
    return results;
  }
};

const enrichOrganizationsSearch = async(results) => {
  const organizationIds = results.map(u => u['id']);
  const { hits: { hits: tickets }} = await searchMultipleTerms('tickets', ['organization_id'], organizationIds);

  const flattenedTickets = tickets.map(hit => hit['_source']);

  results.forEach(organization => {
    const relatedTickets = flattenedTickets.filter(ticket => {
      return ticket['organization_id'] == organization['id'];
    });
    organization.relatedTickets = relatedTickets;
  });

  const { hits: { hits: users }} = await searchMultipleTerms('users', ['organization_id'], organizationIds);

  const flattenedUsers = users.map(hit => hit['_source']);

  results.forEach(organization => {
    const relatedUsers = flattenedUsers.filter(user => {
      return user['organization_id'] == organization['id'];
    });
    organization.relatedUsers = relatedUsers;
  });

  return results;
}

const enrichTicketsSearch = async(results) => {
  const organizationIds = results.map(t => t['organization_id'])
                                          .filter(t => t != null);

  const { hits: { hits: organizations }} = await searchMultipleTerms('organizations', ['id'], organizationIds);

  const flattenedOrganizations = organizations.map(hit => hit['_source']);
  results.forEach(ticket => {
    const relatedOrganization = flattenedOrganizations.filter(organization => {
      return organization['id'] == ticket['organization_id'];
    })[0];
    ticket.organization = relatedOrganization;
  });

  const submitterIds = results.map(t => t['submitter_id']);
  const assigneeIds = results.map(t => t['assignee_id'])
                                      .filter(t => t != null);
  const userIds = submitterIds.concat(assigneeIds);
  const { hits: { hits: users }} = await searchMultipleTerms('users', ['id'], userIds);

  const flattenedUsers = users.map(hit => hit['_source']);
  results.forEach(ticket => {
    const relatedSubmitterUser = flattenedUsers.filter(user => {
      return user['id'] == ticket['submitter_id'];
    })[0];
    ticket.submitterUser = relatedSubmitterUser;

    const relatedAssigneeUser = flattenedUsers.filter(user => {
      return user['id'] == ticket['assignee_id'];
    })[0];
    ticket.assigneeUser = relatedAssigneeUser;
  });

  return results;
};

const enrichUsersSearch = async(results) => {
  const userIds = results.map(u => u['id']);
  const relatedTicketFields = ['submitter_id', 'assignee_id'];
  const { hits: { hits: tickets }} = await searchMultipleTerms('tickets', relatedTicketFields, userIds);

  const flattenedTickets = tickets.map(hit => hit['_source']);

  results.forEach(user => {
    const relatedTickets = flattenedTickets.filter(ticket => {
      return relatedTicketFields.some(field => ticket[field] == user['id']);
    });
    user.relatedTickets = relatedTickets;
  });

  return results;
}

module.exports = {
  populate,
  getSearchableFields,
  getSearch
}