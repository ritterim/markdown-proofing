#! /usr/bin/env node

import meow from 'meow';
import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';
import MarkdownProofing from './lib/markdown-proofing';
import StatisticsAnalyzer from './lib/analyzers/statistics';

const cli = meow({
  help: [
    'Usage',
    '  $ markdown-proofing [...file-glob]',
    '',
    'Options',
    '  -c, --configuration  Specify a configuration file to use. [Default: .markdown-proofing]',
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
  ]
});

const input = cli.input || [];
const flags = cli.flags || {};

if (!input) {
  console.log(cli.help);
  process.exit(1);
}

function processFile(file) {
  const markdownProofing = new MarkdownProofing()
    .addAnalyzer(StatisticsAnalyzer);

  // TODO: Get / set configuration

  fs.readFile(file, 'utf-8', (err, data) => {
    const results = markdownProofing.proof(data);

    console.log();
    console.log(new Array(file.length).join('-'));
    console.log(file);
    console.log(new Array(file.length).join('-'));
    console.log();

    results.messages.forEach(message => {
      console.log(`${message.type}: ${message.message}`);
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
