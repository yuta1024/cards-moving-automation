module.exports = {
  first: function () {
    return {
      repository: {
        projects: {
            pageInfo: {
              hasNextPage: true,
              endCursor: '2nd'
            },
            nodes: [
              { name: 'project-1', number: 1 },
              { name: 'project-2', number: 2 }
            ]
        }
      }
    };
  },
  second: function () {
    return {
      repository: {
        projects: {
            pageInfo: {
              hasNextPage: false
            },
            nodes: [
              { name: 'project-3', number: 3 }
            ]
        }
      }
    };
  }
};
