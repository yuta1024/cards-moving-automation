const buildIssue = (title, updatedAt, projectCard = null) => {
  if (projectCard === null) {
    return {
      title: title,
      updatedAt: updatedAt
    }
  } else {
    return {
      title: title,
      updatedAt: updatedAt,
      projectCards: {
        nodes: [projectCard]
      }
    }
  }
}

const buildProjectCard = (id, columnName, projectName, updatedAt) => {
  return {
    id: id,
    column: {
      name: columnName
    },
    project: {
      name: projectName
    },
    updatedAt: updatedAt
  }
};

module.exports = {
  first: function () {
    return {
      repository: {
        issues: {
          pageInfo: {
            hasNextPage: true,
            endCursor: '2nd'
          },
          nodes: [
            buildIssue('title-1', '2020-01-01T09:00:00Z'),
            buildIssue('title-2', '2020-01-02T09:00:00Z')
          ]
        }
      }
    };
  },
  second: function () {
    return {
      repository: {
        issues: {
          pageInfo: {
            hasNextPage: false
          },
          nodes: [
            buildIssue('title-3', '2020-01-03T09:00:00Z')
          ]
        }
      }
    };
  },
  verbose: function () {
    return {
      repository: {
        issues: {
          pageInfo: {
            hasNextPage: false
          },
          nodes: [
            buildIssue(
              'title-1',
              '2020-01-01T09:00:00Z',
              buildProjectCard(
                'c1',
                'col-2',
                'project-1',
                '2020-01-15T09:00:00Z'
              )
            ),
            buildIssue(
              'title-2',
              '2020-01-15T09:00:00Z',
              buildProjectCard(
                'c2',
                'col-2',
                'project-1',
                '2020-01-01T09:00:00Z'
              )
            ),
            buildIssue(
              'title-3',
              '2020-01-31T09:00:00Z',
              buildProjectCard(
                'c3',
                'col-2',
                'project-1',
                '2020-01-31T09:00:00Z'
              )
            ),
          ]
        }
      }
    };
  }
};
