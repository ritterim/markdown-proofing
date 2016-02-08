#! /usr/bin/env node
'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _markdownProofing = require('./lib/markdown-proofing');

var _markdownProofing2 = _interopRequireDefault(_markdownProofing);

var _statistics = require('./lib/analyzers/statistics');

var _statistics2 = _interopRequireDefault(_statistics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)({
  help: ['Usage', '  $ markdown-proofing [...file-glob]', '', 'Options', '  -c, --configuration  Specify a configuration file to use. [Default: .markdown-proofing]', '', 'Examples', '  $ markdown-proofing ./file1.md', '  Analyze ./file1.md file', '  $ markdown-proofing ./file1.md ./file2.md', '  Analyze ./file1.md and ./file2.md files', '  $ markdown-proofing -c ./custom-configuration.json ./file1.md', '  Analyze ./file.md file using ./custom-configuration.json', '  $ markdown-proofing **/*.md', '  Analyze all .md files recursively']
});

var input = cli.input || [];
var flags = cli.flags || {};

if (!input) {
  console.log(cli.help);
  process.exit(1);
}

function processFile(file) {
  var markdownProofing = new _markdownProofing2.default().addAnalyzer(_statistics2.default);

  // TODO: Get / set configuration

  _fs2.default.readFile(file, 'utf-8', function (err, data) {
    var results = markdownProofing.proof(data);

    console.log();
    console.log(new Array(file.length).join('-'));
    console.log(file);
    console.log(new Array(file.length).join('-'));
    console.log();

    results.messages.forEach(function (message) {
      console.log(message.type + ': ' + message.message);
    });
  });
}

input.forEach(function (x) {
  var globOptions = {};

  (0, _glob2.default)(x, globOptions, function (er, files) {
    if (er) throw er;
    files.forEach(function (file) {
      return processFile(file);
    });
  });
});