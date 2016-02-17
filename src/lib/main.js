import appRootPath from 'app-root-path';
import fs from 'fs';
import Rule from './rule';

export default class MarkdownProofing {
  constructor() {
    this.analyzers = [];
    this.rules = [];
  }

  // The `rootFolder` parameter helps with testing
  static createUsingConfiguration(configuration, rootFolder = '/lib') {
    const markdownProofing = new MarkdownProofing();

    if (configuration.presets) {
      configuration.presets.forEach(x => {
        const presetFilePath = appRootPath.resolve(`${rootFolder}/presets/${x}.json`);
        const presetConfiguration = JSON.parse(fs.readFileSync(presetFilePath, 'utf-8'));

        this.addAssetsToInstance(
          markdownProofing, presetConfiguration, rootFolder);
      });
    }

    this.addAssetsToInstance(
      markdownProofing, configuration, rootFolder);

    return markdownProofing;
  }

  static addAssetsToInstance(markdownProofing, configuration, rootFolder) {
    if (configuration.analyzers) {
      configuration.analyzers.forEach(x => {
        const analyzer = require(appRootPath.resolve(`${rootFolder}/analyzers/${x}.js`));
        markdownProofing.addAnalyzer(analyzer);
      });
    }

    if (configuration.rules) {
      for (const prop in configuration.rules) {
        const ruleValue = configuration.rules[prop];

        if (ruleValue === 'none') {
          markdownProofing.removeRule(prop);
        } else {
          markdownProofing.addRule(prop, ruleValue);
        }
      }
    }
  }

  addAnalyzer(analyzer) {
    this.analyzers.push(analyzer);

    return this;
  }

  addRule(messageType, ruleCondition) {
    this.rules.push(new Rule(messageType, ruleCondition));

    return this;
  }

  removeRule(messageType) {
    this.rules = this.rules.filter(x => x.messageType !== messageType);

    return this;
  }

  proof(text) {
    const analyzerPromises = [];

    this.analyzers.forEach(x => {
      // Instead of unwrapped the default if present
      // https://www.npmjs.com/package/babel-plugin-add-module-exports
      // may be useful, but I'm not sure and haven't tested it.
      let CurrentAnalyzer;

      if (x && x.default) {
        CurrentAnalyzer = x.default;
      } else {
        CurrentAnalyzer = x;
      }

      // Analyzers can return a promise that resolves with an
      // `AnalyzerResult`, or they can simply return an `AnalyzerResult`.
      const resultOrPromise = new CurrentAnalyzer().analyze(text);

      // If the analyzer output is not a promise,
      // make it into a promise for consistency.
      const promise = resultOrPromise.then
        ? resultOrPromise
        : Promise.resolve(resultOrPromise);

      analyzerPromises.push(promise);
    });

    return Promise.all(analyzerPromises).then(x => {
      // Collect any messages outputted by any analyzers
      const analyzerMessages = [];

      x.forEach(y => {
        const applicableMessages = y.messages.filter(
          message => this.rules.some(
            rule => rule.matchesCondition(message)));

        applicableMessages.forEach(m => analyzerMessages.push(m));
      });

      // Sort by message type ascending
      analyzerMessages.sort((a, b) => a.type.localeCompare(b.type));

      return {
        messages: analyzerMessages
      };
    });
  }
}
