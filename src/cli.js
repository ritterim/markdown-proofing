#! /usr/bin/env node

/* eslint-disable no-console */

import appRootPath from 'app-root-path';
import meow from 'meow';
import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';

import MarkdownProofing from './lib/main';

const defaultConfigurationPath = '/.markdown-proofing';

const cli = meow({
  help: [
    'Usage',
    '  $ markdown-proofing [...file-glob]',
    '',
    'Options',
    '  -c, --configuration  Specify a configuration file to use. [Default: .markdown-proofing]',
    '  -n, --no-colors      Do not apply colors to the output.   [Default: false]',
    '',
    'Examples',
    '  $ markdown-proofing ./file1.md',
    '  Analyze ./file1.md file',
    '  $ markdown-proofing ./file1.md ./file2.md',
    '  Analyze ./file1.md and ./file2.md files',
    '  $ markdown-proofing -c ./custom-configuration.json ./file1.md',
    '  Analyze ./file.md file using ./custom-configuration.json',
    '  $ markdown-proofing **/*.md',
    '  Analyze all .md files recursively'
  ],
  alias: {
    c: 'configuration',
    n: 'no-colors'
  }
});

const input = cli.input || [];
const flags = cli.flags || {};

if (!cli.input || cli.input.length === 0) {
  console.log(cli.help);

/* eslint-disable no-process-exit */

  process.exit(1);

/* eslint-enable no-process-exit */
}

//
// Create markdownProofing using configuration file from disk
//

const filePath = appRootPath.resolve(flags.configuration || defaultConfigurationPath);

try {
  fs.accessSync(filePath, fs.F_OK);
} catch (e) {
  throw new Error(`Configuration was not found or could not be read from '${filePath}'.`, e);
}

const configuration = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const markdownProofing = MarkdownProofing.createUsingConfiguration(configuration);

//
// Process input file(s)
//

// Check for `error`, `warning`, `info` in that order.
// This is necessary to avoid displaying an error as a warning, etc.
function getRuleConditionToApply(ruleConditions) {
  // Use startsWith, as a condition could be `error < 30`
  if (ruleConditions.some(x => x.startsWith('error'))) {
    return 'error';
  } else if (ruleConditions.some(x => x.startsWith('warning'))) {
    return 'warning';
  } else if (ruleConditions.some(x => x.startsWith('info'))) {
    return 'info';
  }

  throw new Error('ruleConditions did not match any expected rule conditions.');
}

function displayResults(results) {
  results.messages.forEach(message => {

/* eslint-disable no-undefined */

    const location = (message.line !== undefined && message.column !== undefined)
      ? ` (${message.line}:${message.column})`
      : '';

/* eslint-enable no-undefined */

    const ruleConditions = markdownProofing
      .rules
      .filter(x => x.messageType === message.type)
      .map(x => x.condition);

    let ruleConditionToApply = getRuleConditionToApply(ruleConditions);
    const messageTemplate = `[${ruleConditionToApply}] ${message.type}${location} : ${message.text}`;

    if (!flags['no-colors']) {
      const colorsLookup = {
        info: chalk.blue,
        warning: chalk.yellow,
        error: chalk.red
      };

      console.log(colorsLookup[ruleConditionToApply](messageTemplate));
    } else {
      console.log(messageTemplate);
    }
  });
}

function processFile(file) {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;

    markdownProofing.proof(data)
      .then(results => {

        console.log();
        console.log(new Array(file.length + 1).join('-'));
        console.log(file);
        console.log(new Array(file.length + 1).join('-'));
        console.log();

        displayResults(results);
      });
  });
}

input.forEach(x => {
  const globOptions = {};

  glob(x, globOptions, (er, files) => {
    if (er) throw er;
    files.forEach(file => processFile(file));
  });
});
