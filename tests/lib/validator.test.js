const validator = require('../../lib/validator');

describe('./lib/validator', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    for (const key of [
      'INPUT_REPO_TOKEN',
      'INPUT_PROJECT',
      'INPUT_FROM_COLUMN',
      'INPUT_TO_COLUMN',
      'INPUT_EXPIRATION_DAYS'
    ]) {
      delete process.env[key]
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getArgs', () => {
    it('should be error if `repo-token` is undefined', () => {
      return expect(validator.getArgs()).rejects.toThrow('Input required and not supplied: repo_token');
    });

    it('should be error if `project` is undefined', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';

      return expect(validator.getArgs()).rejects.toThrow('Input required and not supplied: project');
    });

    it('should be error if `from_column` is undefined', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';
      process.env.INPUT_PROJECT = 'project';

      return expect(validator.getArgs()).rejects.toThrow('Input required and not supplied: from_column');
    });

    it('should be error if `to_column` is undefined', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';
      process.env.INPUT_PROJECT = 'project';
      process.env.INPUT_FROM_COLUMN = 'from';

      return expect(validator.getArgs()).rejects.toThrow('Input required and not supplied: to_column');
    });

    it('should be error if `expiration_days` is undefined', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';
      process.env.INPUT_PROJECT = 'project';
      process.env.INPUT_FROM_COLUMN = 'from';
      process.env.INPUT_TO_COLUMN = 'to';

      return expect(validator.getArgs()).rejects.toThrow('`expiration-days` must be integer');
    });

    it('should be error if `expiration_days` is not integer', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';
      process.env.INPUT_PROJECT = 'project';
      process.env.INPUT_FROM_COLUMN = 'from';
      process.env.INPUT_TO_COLUMN = 'to';
      process.env.INPUT_EXPIRATION_DAYS = 'foo';

      return expect(validator.getArgs()).rejects.toThrow('`expiration-days` must be integer');
    });

    it('should return arguments', () => {
      process.env.INPUT_REPO_TOKEN = 'repo_token';
      process.env.INPUT_PROJECT = 'project';
      process.env.INPUT_FROM_COLUMN = 'from';
      process.env.INPUT_TO_COLUMN = 'to';
      process.env.INPUT_EXPIRATION_DAYS = '30';

      return validator.getArgs().then(args => {
        expect(args).toStrictEqual({
          token: 'repo_token',
          project: 'project',
          fromColumn: 'from',
          toColumn: 'to',
          expirationDays: '30'
        });
      });
    });
  });
});
