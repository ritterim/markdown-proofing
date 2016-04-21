#! /usr/bin/env node

import meow from 'meow';
import Main from './lib/main';

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
  console.log(cli.help); // eslint-disable-line no-console
  process.exit(1); // eslint-disable-line no-process-exit
}

new Main().run(input, flags);
