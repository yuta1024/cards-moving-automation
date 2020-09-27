const core = require('@actions/core');
const github = require('@actions/github');
const moment = require('moment-timezone');
const project = require('./project');
const validator = require('./validator');

module.exports = async() => {
  const now = moment();
  const args = await validator.getArgs();
  const { owner, repo } = github.context.repo;
  const octokit = github.getOctokit(args.token);

  const targetProject = (await project.getAllProjects(octokit, owner, repo))
    .find(project => project.name === args.project);
  if (targetProject === undefined) {
    throw new Error(`${args.project} is not found in ${owner}/${repo}`);
  }

  const targetColumn = (await project.getAllColumns(octokit, owner, repo, targetProject.number))
    .find(column => column.name === args.toColumn);
  if (targetColumn === undefined) {
    throw new Error(`${args.toColumn} is not found in ${args.project}`);
  }

  const targetIssues = (await project.getAllOpenedIssues(octokit, owner, repo))
    .filter(issue =>
      issue.projectCards.nodes.length > 0 &&
      issue.projectCards.nodes[0].column.name === args.fromColumn &&
      issue.projectCards.nodes[0].project.name === args.project &&
      moment(issue.updatedAt).add(args.expirationDays, 'd').isBefore(now) &&
      moment(issue.projectCards.nodes[0].updatedAt).add(args.expirationDays, 'd').isBefore(now)
    );

  if (targetIssues.length === 0) {
    core.info('There are no cards to move.');
    return;
  }

  for (const issue of targetIssues) {
    core.info(`move "${issue.title}" from "${args.fromColumn}" to "${args.toColumn}".`)
    await project.moveCard(octokit, issue.projectCards.nodes[0].id, targetColumn.id);
  }
};
