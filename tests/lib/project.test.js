const project = require('../../lib/project');
const columnFixture = require('./fixtures/column');
const issueFixture = require('./fixtures/issue');
const projectFixture = require('./fixtures/project');

describe('./lib/project', () => {
  describe('getAllProjects', () => {
    it('should return all projects', () => {
      const octokitMock = {
        graphql: jest.fn((_, args) => {
          return args.cursor === null ? projectFixture.first() : projectFixture.second()
        })
      };

      return project.getAllProjects(octokitMock, 'test-org', 'test-repo').then(projects => {
        expect(octokitMock.graphql).toBeCalledTimes(2);
        expect(octokitMock.graphql.mock.calls[0][1].cursor).toBeNull();
        expect(octokitMock.graphql.mock.calls[1][1].cursor).toBe('2nd');
        expect(projects).toStrictEqual(
          [
            { name: 'project-1', number: 1 },
            { name: 'project-2', number: 2 },
            { name: 'project-3', number: 3 }
          ]
        );
      });
    });
  });

  describe('getAllColumns', () => {
    it('should return all columns at the specified project', () => {
      const octokitMock = {
        graphql: jest.fn((_, args) => {
          return args.cursor === null ? columnFixture.first() : columnFixture.second()
        })
      };

      return project.getAllColumns(octokitMock, 'test-org', 'test-repo', 1).then(columns => {
        expect(octokitMock.graphql).toBeCalledTimes(2);
        expect(octokitMock.graphql.mock.calls[0][1].cursor).toBeNull();
        expect(octokitMock.graphql.mock.calls[1][1].cursor).toBe('2nd');
        expect(columns).toStrictEqual(
          [
            { id: 'c1', name: 'col-1' },
            { id: 'c2', name: 'col-2' },
            { id: 'c3', name: 'col-3' }
          ]
        );
      });
    });
  });

  describe('getAllOpenedIssues', () => {
    it('should return opened issues', () => {
      const octokitMock = {
        graphql: jest.fn((_, args) => {
          return args.cursor === null ? issueFixture.first() : issueFixture.second()
        })
      };

      return project.getAllOpenedIssues(octokitMock, 'test-org', 'test-repo').then(issues => {
        expect(octokitMock.graphql).toBeCalledTimes(2);
        expect(octokitMock.graphql.mock.calls[0][1].cursor).toBeNull();
        expect(octokitMock.graphql.mock.calls[1][1].cursor).toBe('2nd');
        expect(issues).toStrictEqual(
          [
            { title: 'title-1', updatedAt: '2020-01-01T09:00:00Z' },
            { title: 'title-2', updatedAt: '2020-01-02T09:00:00Z' },
            { title: 'title-3', updatedAt: '2020-01-03T09:00:00Z' },
          ]
        );
      });
    });
  });

  describe('moveCard', () => {
    it('should move the specified card', () => {
      const octokitMock = {
        graphql: jest.fn(() => {
          return {
            moveProjectCard: {
              clientMutationId: null
            }
          }
        })
      };

      return project.moveCard(octokitMock, 'c1', 'col1').then(result => {
        expect(result.moveProjectCard.clientMutationId).toBeNull();
      });
    });
  });
});
