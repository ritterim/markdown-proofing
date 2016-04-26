#! /usr/bin/env node

import meow from 'meow';
import JsonFileConfigurationProvider from './lib/jsonFileConfigurationProvider';
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
  $ markdown-proofing ./file1.md',
  Analyze ./file1.md file',
  $ markdown-proofing ./file1.md ./file2.md',
  Analyze ./file1.md and ./file2.md files',
  $ markdown-proofing -c ./custom-configuration.json ./file1.md',
  Analyze ./file.md file using ./custom-configuration.json',
  $ markdown-proofing **/*.md',
  Analyze all .md files recursively`, {
    alias: {
      c: 'configuration',
      t: 'throw'
    },
    default: defaultFlags
  });

const input = cli.input || [];
const flags = cli.flags || {};

if (!cli.input || cli.input.length === 0) {
  console.log(cli.help); // eslint-disable-line no-console
  process.exit(1); // eslint-disable-line no-process-exit
}

const main = new Main(
  input,
  flags,
  new JsonFileConfigurationProvider(flags.configuration || '.markdown-proofing'),
  console);

main.run();
