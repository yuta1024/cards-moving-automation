const core = require('@actions/core');

module.exports.getArgs = async () => {
  const args = {
    token: core.getInput('repo_token', {required: true}),
    project: core.getInput('project', {required: true}),
    fromColumn: core.getInput('from_column', {required: true}),
    toColumn: core.getInput('to_column', {required: true}),
    expirationDays: core.getInput('expiration_days')
  }

  if (isNaN(parseInt(core.getInput('expiration_days')))) {
    throw Error('`expiration-days` must be integer')
  }

  return args;
};
