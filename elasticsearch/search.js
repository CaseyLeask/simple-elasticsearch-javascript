const {
  indices,
  searchOneTerm,
  searchMultipleTerms
} = require('./client');

const getSearchableFields = async(sources) => {
  const indicesData = await indices(sources);

  const flattenedData = {};

  sources.forEach(s => {
    flattenedData[s] = Object.keys(indicesData[s]['mappings'][s]['properties']);
  });

  return flattenedData;
};

const getSearch = async(source, term, value) => {
  if (source == 'organizations') {
    return enrichOrganizationsSearch(source, term, value);
  } else if (source == 'tickets') {
    return enrichTicketsSearch(source, term, value);
  } else if (source == 'users') {
    return enrichUsersSearch(source, term, value);
  } else {
    return searchQuery(source, term, value);
  }
};

const searchQuery = async(source, term, value) => {
  let hits;

  if (Array.isArray(term) || Array.isArray(value)) {
    ({ hits: { hits }} = await searchMultipleTerms(source, term, value));
  } else {
    ({ hits: { hits }} = await searchOneTerm(source, term, value));
  }

  return hits.map(hit => hit['_source']);
}

const enrichOrganizationsSearch = async(source, term, value) => {
  const results = await searchQuery(source, term, value);

  const organizationIds = results.map(u => u['id']);
  const tickets = await searchQuery('tickets', 'organization_id', organizationIds);

  results.forEach(organization => {
    const relatedTickets = tickets.filter(ticket => {
      return ticket['organization_id'] == organization['id'];
    });
    organization.relatedTickets = relatedTickets;
  });

  const users = await searchQuery('users', 'organization_id', organizationIds);

  results.forEach(organization => {
    const relatedUsers = users.filter(user => {
      return user['organization_id'] == organization['id'];
    });
    organization.relatedUsers = relatedUsers;
  });

  return results;
}

const enrichTicketsSearch = async(source, term, value) => {
  const results = await searchQuery(source, term, value);

  const organizationIds = results.map(t => t['organization_id'])
                                 .filter(t => t != null);

  const organizations = await searchQuery('organizations', 'id', organizationIds);

  results.forEach(ticket => {
    const relatedOrganization = organizations.filter(organization => {
      return organization['id'] == ticket['organization_id'];
    })[0];
    ticket.organization = relatedOrganization;
  });

  const submitterIds = results.map(t => t['submitter_id']);
  const assigneeIds = results.map(t => t['assignee_id'])
                                      .filter(t => t != null);
  const userIds = submitterIds.concat(assigneeIds);

  const users = await searchQuery('users', 'id', userIds);

  results.forEach(ticket => {
    const relatedSubmitterUser = users.filter(user => {
      return user['id'] == ticket['submitter_id'];
    })[0];
    ticket.submitterUser = relatedSubmitterUser;

    const relatedAssigneeUser = users.filter(user => {
      return user['id'] == ticket['assignee_id'];
    })[0];
    ticket.assigneeUser = relatedAssigneeUser;
  });

  return results;
};

const enrichUsersSearch = async(source, term, value) => {
  const results = await searchQuery(source, term, value);

  const organizationIds = results.map(t => t['organization_id'])
                                          .filter(t => t != null);

  const organizations = await searchQuery('organizations', 'id', organizationIds);

  results.forEach(ticket => {
    const relatedOrganization = organizations.filter(organization => {
      return organization['id'] == ticket['organization_id'];
    })[0];
    ticket.organization = relatedOrganization;
  });

  const userIds = results.map(u => u['id']);
  const relatedTicketFields = ['submitter_id', 'assignee_id'];

  const tickets = await searchQuery('tickets', relatedTicketFields, userIds);

  results.forEach(user => {
    const relatedTickets = tickets.filter(ticket => {
      return relatedTicketFields.some(field => ticket[field] == user['id']);
    });
    user.relatedTickets = relatedTickets;
  });

  return results;
};

module.exports = {
  getSearch,
  getSearchableFields
};