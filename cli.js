#! /usr/bin/env node
'use strict';

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _main = require('./lib/main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

var defaultConfigurationPath = '/.markdown-proofing';

var cli = (0, _meow2.default)({
  help: ['Usage', '  $ markdown-proofing [...file-glob]', '', 'Options', '  -c, --configuration  Specify a configuration file to use. [Default: .markdown-proofing]', '  -n, --no-colors      Do not apply colors to the output.   [Default: false]', '', 'Examples', '  $ markdown-proofing ./file1.md', '  Analyze ./file1.md file', '  $ markdown-proofing ./file1.md ./file2.md', '  Analyze ./file1.md and ./file2.md files', '  $ markdown-proofing -c ./custom-configuration.json ./file1.md', '  Analyze ./file.md file using ./custom-configuration.json', '  $ markdown-proofing **/*.md', '  Analyze all .md files recursively'],
  alias: {
    c: 'configuration',
    n: 'no-colors'
  }
});

var input = cli.input || [];
var flags = cli.flags || {};

if (!cli.input || cli.input.length === 0) {
  console.log(cli.help);

  /* eslint-disable no-process-exit */

  process.exit(1);

  /* eslint-enable no-process-exit */
}

//
// Create markdownProofing using configuration file from disk
//

var filePath = _appRootPath2.default.resolve(flags.configuration || defaultConfigurationPath);

try {
  _fs2.default.accessSync(filePath, _fs2.default.F_OK);
} catch (e) {
  throw new Error('Configuration was not found or could not be read from \'' + filePath + '\'.', e);
}

var configuration = JSON.parse(_fs2.default.readFileSync(filePath, 'utf-8'));
var markdownProofing = _main2.default.createUsingConfiguration(configuration);

//
// Process input file(s)
//

// Check for `error`, `warning`, `info` in that order.
// This is necessary to avoid displaying an error as a warning, etc.
function getRuleConditionToApply(ruleConditions) {
  // Use startsWith, as a condition could be `error < 30`
  if (ruleConditions.some(function (x) {
    return x.startsWith('error');
  })) {
    return 'error';
  } else if (ruleConditions.some(function (x) {
    return x.startsWith('warning');
  })) {
    return 'warning';
  } else if (ruleConditions.some(function (x) {
    return x.startsWith('info');
  })) {
    return 'info';
  }

  throw new Error('ruleConditions did not match any expected rule conditions.');
}

function displayResults(results) {
  results.messages.forEach(function (message) {

    /* eslint-disable no-undefined */

    var location = message.line !== undefined && message.column !== undefined ? ' (' + message.line + ':' + message.column + ')' : '';

    /* eslint-enable no-undefined */

    var ruleConditions = markdownProofing.rules.filter(function (x) {
      return x.messageType === message.type;
    }).map(function (x) {
      return x.condition;
    });

    var ruleConditionToApply = getRuleConditionToApply(ruleConditions);
    var messageTemplate = '[' + ruleConditionToApply + '] ' + message.type + location + ' : ' + message.text;

    if (!flags['no-colors']) {
      var colorsLookup = {
        info: _chalk2.default.blue,
        warning: _chalk2.default.yellow,
        error: _chalk2.default.red
      };

      console.log(colorsLookup[ruleConditionToApply](messageTemplate));
    } else {
      console.log(messageTemplate);
    }
  });
}

function processFile(file) {
  _fs2.default.readFile(file, 'utf-8', function (err, data) {
    if (err) throw err;

    markdownProofing.proof(data).then(function (results) {
      var line = new Array(file.length + 1).join('-');

      console.log('\n' + line + '\n' + file + '\n' + line + '\n');

      displayResults(results);
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