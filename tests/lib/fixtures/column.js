module.exports = {
  first: function () {
    return {
      repository: {
        project: {
          columns: {
            pageInfo: {
              hasNextPage: true,
              endCursor: '2nd'
            },
            nodes: [
              { id: 'c1', name: 'col-1' },
              { id: 'c2', name: 'col-2' }
            ]
          }
        }
      }
    };
  },
  second: function () {
    return {
      repository: {
        project: {
          columns: {
            pageInfo: {
              hasNextPage: false
            },
            nodes: [
              { id: 'c3', name: 'col-3' }
            ]
          }
        }
      }
    };
  }
};
