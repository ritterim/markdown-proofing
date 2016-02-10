#! /usr/bin/env node

import appRootPath from 'app-root-path';
import meow from 'meow';
import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';

import MarkdownProofing from './lib/markdown-proofing';

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
    '  Analyze all .md files recursively',
  ],
  alias: {
    c: 'configuration',
    n: 'no-colors'
  }
});

const input = cli.input || [];
const flags = cli.flags || {};

if (!input) {
  console.log(cli.help);
  process.exit(1);
}

//
// Create markdownProofing using configuration file from disk
//

const filePath = appRootPath.resolve(cli.flags.configuration || defaultConfigurationPath);

try {
  fs.accessSync(filePath, fs.F_OK);
}
catch (e) {
  throw new Error(`Configuration was not found or could not be read from '${filePath}'.`, e);
}

const configuration = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const markdownProofing = MarkdownProofing.createUsingConfiguration(configuration);

//
// Process input file(s)
//

function processFile(file) {
  fs.readFile(file, 'utf-8', (err, data) => {
    const results = markdownProofing.proof(data);

    console.log();
    console.log(new Array(file.length).join('-'));
    console.log(file);
    console.log(new Array(file.length).join('-'));
    console.log();

    results.messages.forEach(message => {
      if (!cli.flags['no-colors']) {
        switch (message.type) {
          case 'info':
            console.log(chalk.blue(`${message.type}: ${message.message}`));
            break;
          case 'warning':
            console.log(chalk.yellow(`${message.type}: ${message.message}`));
            break;
          case 'error':
            console.log(chalk.red(`${message.type}: ${message.message}`));
            break;
          default:
            console.log(`${message.type}: ${message.message}`);
        }
      }
      else {
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
