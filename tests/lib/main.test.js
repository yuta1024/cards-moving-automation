const columnFixture = require('./fixtures/column');
const issueFixture = require('./fixtures/issue');
const projectFixture = require('./fixtures/project');

describe('./lib/main', () => {
  let main;
  let mock;

  beforeEach(() => {
    // set 2020-02-01T00:00:00+00:00
    jest.spyOn(Date, 'now').mockImplementation(() => 1580515200000);
    jest.mock('@actions/core');
    jest.mock('@actions/github', () => ({
      context: {
        repo: {
          owner: 'test-org',
          repo: 'test-repo'
        }
      },
      getOctokit: jest.fn()
    }));
    jest.mock('../../lib/project');
    jest.mock('../../lib/validator');

    mock = {
      core: require('@actions/core'),
      project: require('../../lib/project'),
      validator: require('../../lib/validator')
    };
    main = require('../../lib/main');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('main', () => {
    it('should be error if target project is not found', () => {
      mock.validator.getArgs.mockResolvedValue({
        token: 'test-token',
        project: 'project-404',
      });
      mock.project.getAllProjects.mockResolvedValue(projectFixture.first().repository.projects.nodes);

      return expect(main()).rejects.toThrow('project-404 is not found in test-org/test-repo');
    });

    it('should be error if target column is not found', () => {
      mock.validator.getArgs.mockResolvedValue({
        token: 'test-token',
        project: 'project-1',
        toColumn: 'col-404'
      });
      mock.project.getAllProjects.mockResolvedValue(projectFixture.first().repository.projects.nodes);
      mock.project.getAllColumns.mockResolvedValue(columnFixture.first().repository.project.columns.nodes);

      return expect(main()).rejects.toThrow('col-404 is not found in project-1');
    });

    it('should be error if something happens during moving cards', () => {
      mock.validator.getArgs.mockResolvedValue({
        token: 'test-token',
        project: 'project-1',
        toColumn: 'col-1',
        fromColumn: 'col-2',
        expirationDays: 1
      });
      mock.project.getAllProjects.mockResolvedValue(projectFixture.first().repository.projects.nodes);
      mock.project.getAllColumns.mockResolvedValue(columnFixture.first().repository.project.columns.nodes);
      mock.project.getAllOpenedIssues.mockResolvedValue(issueFixture.verbose().repository.issues.nodes);
      mock.project.moveCard.mockRejectedValue(new Error('something happens'));

      return expect(main()).rejects.toThrow('something happens');
    });

    it('should move two cards', () => {
      mock.validator.getArgs.mockResolvedValue({
        token: 'test-token',
        project: 'project-1',
        toColumn: 'col-1',
        fromColumn: 'col-2',
        expirationDays: 10
      });
      mock.project.getAllProjects.mockResolvedValue(projectFixture.first().repository.projects.nodes);
      mock.project.getAllColumns.mockResolvedValue(columnFixture.first().repository.project.columns.nodes);
      mock.project.getAllOpenedIssues.mockResolvedValue(issueFixture.verbose().repository.issues.nodes);
      mock.project.moveCard.mockResolvedValue({});

      return main().then(() => {
        expect(mock.project.moveCard).toBeCalledTimes(2);
        expect(mock.core.info.mock.calls[0][0]).toBe('move "title-1" from "col-2" to "col-1".');
        expect(mock.core.info.mock.calls[1][0]).toBe('move "title-2" from "col-2" to "col-1".');
      });
    });
  });
});
