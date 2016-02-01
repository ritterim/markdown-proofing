#! /usr/bin/env node

import meow from 'meow';
import chalk from 'chalk';
import textProofing from './lib/';

const cli = meow({
  help: [
    'Usage',
    '  $ text-proofing [input]',
    '',
    'Options',
    '  --foo  Lorem ipsum. [Default: false]',
    '',
    'Examples',
    '  $ text-proofing',
    '  unicorns & rainbows',
    '  $ text-proofing ponies',
    '  ponies & rainbows'
  ]
});

const input = cli.input || [];
const flags = cli.flags || {};

console.log(cli.help);
