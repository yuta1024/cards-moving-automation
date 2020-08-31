const core = require('@actions/core');
const main = require('./lib/main');

(async () => {
  try {
    await main();
  } catch (err) {
    core.setFailed(err.message);
  }
})();
