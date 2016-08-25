import chalk from 'chalk';
import glob from 'glob';
import fs from 'fs';
import MarkdownProofing from './markdownProofing';

export default class Main {
  constructor(cli, configurationProvider, logger, stdinHelper) {
    this.cli = cli;
    this.configurationProvider = configurationProvider;
    this.logger = logger;
    this.stdinHelper = stdinHelper;
  }

  run() {
    let items = this._getItemsFromInput(this.cli.input);

    if (this.cli.input.length === 0 && items.length === 0) {
      items = this._getItemsFromStandardInput();
    }

    if (items.length === 0) {
      this.logger.log(this.cli.help);
    }

    return this._processItems(items);
  }

  _getItemsFromInput(input) {
    const items = [];

    input.forEach(x => {
      const files = glob.sync(x, {});

      files.forEach(file => {
        const text = fs.readFileSync(file, 'utf-8');

        items.push({
          info: file,
          text: text
        });
      });
    });

    return items;
  }

  _getItemsFromStandardInput() {
    const items = [];

    const text = this.stdinHelper.readAllSync();

    if (text !== undefined && text !== null) { // eslint-disable-line no-undefined
      items.push({
        info: 'stdin',
        text: text
      });
    }

    return items;
  }

  _processItems(items) {
    const configuration = this.configurationProvider.getConfiguration();
    const markdownProofing = MarkdownProofing.createUsingConfiguration(configuration);

    const promises = [];
    let errorsCount = 0;

    items.forEach(item => {
      const promise = markdownProofing
        .proof(item.text)
        .then(results => {
          errorsCount += this._displayResults(item.info, markdownProofing.rules, results);
        });

      promises.push(promise);
    });

    return Promise.all(promises).then(() => {
      if (this.cli.flags.throw && errorsCount > 0) {
        throw new Error(`${errorsCount} ${errorsCount > 1 ? 'errors were' : 'error was'} encountered while proofing.`);
      }
    });
  }

  _displayResults(info, rules, results) {
    const line = new Array(info.length + 1).join('-');
    this.logger.log(`\n${line}\n${info}\n${line}\n`);

    let errorsCount = 0;

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
        errorsCount++;
      } else if (applicableRules.some(x => x.condition.startsWith('warning'))) {
        ruleConditionToApply = 'warning';
      } else if (applicableRules.some(x => x.condition.startsWith('info'))) {
        ruleConditionToApply = 'info';
      } else {
        throw new Error('An unexpected error occurred: '
          + 'The applicableRules did not match any of the handled conditions.');
      }

      const messageTemplate = `[${ruleConditionToApply}] ${message.type}${location} : ${message.text}`;

      if (this.cli.flags.color) {
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

    return errorsCount;
  }
}
