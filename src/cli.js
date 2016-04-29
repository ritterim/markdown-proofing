#! /usr/bin/env node

import meow from 'meow';
import JsonFileConfigurationProvider from './lib/jsonFileConfigurationProvider';
import StdinHelper from './lib/stdin-helper';
import Main from './lib/main';

const defaultFlags = {
  configuration: '.markdown-proofing',
  color: true,
  throw: true
};

const cli = meow(`
Usage
  $ markdown-proofing [options] [...file-glob]

Options
  -c, --configuration      Specify a configuration file to use.               [Default: ${defaultFlags.configuration}]
  --color, --no-color      Specify if color should be applied to the output.  [Default: ${defaultFlags.color}]
  -t, --throw, --no-throw  Do not throw when errors are encountered.          [Default: ${defaultFlags.throw}]

Examples
  $ markdown-proofing ./file1.md
  Analyze ./file1.md file
  $ markdown-proofing ./file1.md ./file2.md
  Analyze ./file1.md and ./file2.md files
  $ cat ./file1.md | markdown-proofing
  Analyze text from standard input
  $ markdown-proofing -c ./custom-configuration.json ./file1.md
  Analyze ./file.md file using ./custom-configuration.json
  $ markdown-proofing **/*.md
  Analyze all .md files recursively`, {
    alias: {
      c: 'configuration',
      t: 'throw'
    },
    default: defaultFlags
  });

const main = new Main(
  cli,
  new JsonFileConfigurationProvider(cli.flags.configuration),
  console,
  new StdinHelper());

main.run();
