# cards-moving-automation
![Test](https://github.com/yuta1024/cards-moving-automation/workflows/Test/badge.svg)

Automate that cards of GitHub Project move to any column with expiration.

**Now, support only `issue`.**

## Building and testing
Install the dependencies
```bash
$ npm install
```

Run the tests
```bash
$ npm test
```

## Usage
See [action.yml](./action.yml) For comprehensive list of options.

Basic:
```yaml
name: 'Move expired cards'
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  automation:
    runs-on: ubuntu-latest
    steps:
      - uses: yuta1024/cards-moving-automation@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          project: 'The name of the GitHub Project'
          from_column: 'The name of the columns which contains cards to move'
          to_column: 'The name of the column to move it into'
```

Configure `expiration_days`:
```yaml
name: 'Move expired cards'
on:
  schedule:
  - cron: "0 0 * * *"

jobs:
  automation:
    runs-on: ubuntu-latest
    steps:
      - uses: yuta1024/cards-moving-automation@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          project: 'The name of the GitHub Project'
          from_column: 'The name of the columns which contains cards to move'
          to_column: 'The name of the column to move it into'
          expiration_days: 30
```
