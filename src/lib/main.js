import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';
import MarkdownProofing from './markdownProofing';

export default class Main {
  constructor(input, flags, configurationProvider, logger) {
    this.input = input;
    this.flags = flags;
    this.configurationProvider = configurationProvider;
    this.logger = logger;
  }

  run() {
    const configuration = this.configurationProvider.getConfiguration();
    const markdownProofing = MarkdownProofing.createUsingConfiguration(configuration);

    const promises = [];

    this.input.forEach(x => {
      const files = glob.sync(x, {});

      files.forEach(file => {
        const text = fs.readFileSync(file, 'utf-8');

        const promise = markdownProofing
          .proof(text)
          .then(results => this._displayResults(file, markdownProofing.rules, results));

        promises.push(promise);
      });
    });

    return Promise.all(promises);
  }

  _displayResults(file, rules, results) {
    const line = new Array(file.length + 1).join('-');
    this.logger.log(`\n${line}\n${file}\n${line}\n`);

    results.messages.forEach(message => {
      const location = (message.line !== undefined && message.column !== undefined) // eslint-disable-line no-undefined
        ? ` (${message.line}:${message.column})`
        : '';

      const applicableRules = rules
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

      if (!this.flags['no-colors']) {
        const colorsLookup = {
          info: chalk.blue,
          warning: chalk.yellow,
          error: chalk.red
        };

        this.logger.log(colorsLookup[ruleConditionToApply](messageTemplate));
      } else {
        this.logger.log(messageTemplate);
      }
    });
  }
}
