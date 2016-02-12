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

function processFile(file) {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;

    const results = markdownProofing.proof(data);

    console.log();
    console.log(new Array(file.length + 1).join('-'));
    console.log(file);
    console.log(new Array(file.length + 1).join('-'));
    console.log();

    results.messages.forEach(message => {
      if (!flags['no-colors']) {
        const colorsLookup = {
          info: chalk.blue,
          warning: chalk.yellow,
          error: chalk.red
        };

        const ruleCondition = markdownProofing
          .rules
          .find(x => x.messageType === message.type)
          .condition;

        console.log(colorsLookup[ruleCondition](`${message.type}: ${message.message}`));
      } else {
        console.log(`${message.type}: ${message.message}`);
      }
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
