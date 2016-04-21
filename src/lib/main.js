import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';
import MarkdownProofing from './markdownProofing';

/* eslint-disable no-console */

export default class Main {
  run(input, flags) {
    //
    // Create markdownProofing using configuration file from disk
    //

    const defaultConfigurationPath = '.markdown-proofing';
    const filePath = flags.configuration || defaultConfigurationPath;

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

    input.forEach(x => {
      const globOptions = {};

      glob(x, globOptions, (er, files) => {
        if (er) throw er;
        files.forEach(file => this._processFile(markdownProofing, file, flags));
      });
    });
  }

  _processFile(markdownProofing, file, flags) {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) throw err;

      markdownProofing.proof(data)
        .then(results => {
          const line = new Array(file.length + 1).join('-');

          console.log(`\n${line}\n${file}\n${line}\n`);

          this._displayResults(markdownProofing, results, flags);
        });
    });
  }

  _displayResults(markdownProofing, results, flags) {
    results.messages.forEach(message => {
      const location = (message.line !== undefined && message.column !== undefined) // eslint-disable-line no-undefined
        ? ` (${message.line}:${message.column})`
        : '';

      const applicableRules = markdownProofing
        .rules
        .filter(rule => rule.messageType === message.type && rule.matchesCondition(message));

      // Use startsWith when determining the condition to display
      // as a condition could be:
      // error < 5
      let ruleConditionToApply;
      if (applicableRules.some(x => x.condition.startsWith('error'))) {
        ruleConditionToApply = 'error';
      } else if (applicableRules.some(x => x.condition.startsWith('warning'))) {
        ruleConditionToApply = 'warning';
      } else if (applicableRules.some(x => x.condition.startsWith('info'))) {
        ruleConditionToApply = 'info';
      } else {
        throw new Error('An unexpected error occurred: '
          + 'The applicableRules did not match any of the handled conditions.');
      }

      const messageTemplate = `[${ruleConditionToApply}] ${message.type}${location} : ${message.text}`;

      if (!flags['no-colors']) {
        const colorsLookup = {
          info: chalk.blue,
          warning: chalk.yellow,
          error: chalk.red
        };

        console.log(colorsLookup[ruleConditionToApply](messageTemplate));
      } else {
        console.log(messageTemplate);
      }
    });
  }
}
