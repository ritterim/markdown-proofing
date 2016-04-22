#! /usr/bin/env node

/* eslint-disable no-console */

import meow from 'meow';
import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';

import MarkdownProofing from './lib/main';

const defaultConfigurationPath = '.markdown-proofing';

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
  process.exit(1); // eslint-disable-line no-process-exit
}

//
// Create markdownProofing using configuration file from disk
//

const filePath = flags.configuration || defaultConfigurationPath;

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

function displayResults(results) {
  results.messages.forEach(message => {
    const location = (message.line !== undefined && message.column !== undefined) // eslint-disable-line no-undefined
      ? ` (${message.line}:${message.column})`
      : '';

    const applicableRules = markdownProofing
      .rules
      .filter(rule => rule.messageType === message.type && rule.matchesCondition(message));

    // Use startsWith when determining the condition to display
    // as a condition could be:
    // error < 5
    let ruleConditionToApply;
    if (applicableRules.some(x => x.condition.startsWith('error'))) {
      ruleConditionToApply = 'error';
    } else if (applicableRules.some(x => x.condition.startsWith('warning'))) {
      ruleConditionToApply = 'warning';
    } else if (applicableRules.some(x => x.condition.startsWith('info'))) {
      ruleConditionToApply = 'info';
    } else {
      throw new Error('An unexpected error occurred: '
        + 'The applicableRules did not match any of the handled conditions.');
    }

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
        const line = new Array(file.length + 1).join('-');

        console.log(`\n${line}\n${file}\n${line}\n`);

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
