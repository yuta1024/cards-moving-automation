const getAllProjects = async (octokit, owner, repo, cursor = null) => {
  const res = await octokit.graphql(`
    query($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        projects(after: $cursor, first:100) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            name
            number
          }
        }
      }
    }`, {owner, repo, cursor});

  const pageInfo = res.repository.projects.pageInfo;
  if (pageInfo.hasNextPage) {
    return [
      ...res.repository.projects.nodes,
      ...await getAllProjects(octokit, owner, repo, pageInfo.endCursor)
    ];
  } else {
    return res.repository.projects.nodes;
  }
};

const getAllColumns = async (octokit, owner, repo, projectNumber, cursor = null) => {
  const res = await octokit.graphql(`
    query($owner: String!, $repo: String!, $projectNumber: Int!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        project(number: $projectNumber) {
          columns(after: $cursor, first:100) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              id
              name
            }
          }
        }
      }
    }`, {owner, repo, projectNumber, cursor});

  const pageInfo = res.repository.project.columns.pageInfo;
  if (pageInfo.hasNextPage) {
    return [
      ...res.repository.project.columns.nodes,
      ...await getAllColumns(octokit, owner, repo, projectNumber, pageInfo.endCursor)
    ];
  } else {
    return res.repository.project.columns.nodes;
  }
}

const getAllOpenedIssues = async (octokit, owner, repo, cursor = null) => {
  const res = await octokit.graphql(`
    query($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        issues(after: $cursor, first: 100, filterBy: {states: [OPEN]}) {
          pageInfo {
            endCursor,
            hasNextPage
          }
          nodes {
            title
            updatedAt
            projectCards(first: 1) {
              nodes {
                id
                column {
                  name
                }
                project {
                  name
                }
                updatedAt
              }
            }
          }
        }
      }
    }`, {owner, repo, cursor});

  const pageInfo = res.repository.issues.pageInfo;
  if (pageInfo.hasNextPage) {
    return [
      ...res.repository.issues.nodes,
      ...await getAllOpenedIssues(octokit, owner, repo, pageInfo.endCursor)
    ];
  } else {
    return res.repository.issues.nodes;
  }
}

// https://docs.github.com/en/graphql/reference/mutations#moveprojectcard
const moveCard = async (octokit, cardId, columnId) => {
  return await octokit.graphql(`
    mutation($cardId: ID!, $columnId: ID!) {
      moveProjectCard(input: {cardId: $cardId, columnId: $columnId}) {
        clientMutationId
      }
    }
  `, {cardId, columnId});
}

module.exports = {
  getAllProjects,
  getAllColumns,
  getAllOpenedIssues,
  moveCard
};
