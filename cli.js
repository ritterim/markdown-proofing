#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lib = require('./lib/');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)({
  help: ['Usage', '  $ text-proofing [input]', '', 'Options', '  --foo  Lorem ipsum. [Default: false]', '', 'Examples', '  $ text-proofing', '  unicorns & rainbows', '  $ text-proofing ponies', '  ponies & rainbows']
});

var input = cli.input || [];
var flags = cli.flags || {};

console.log(cli.help);