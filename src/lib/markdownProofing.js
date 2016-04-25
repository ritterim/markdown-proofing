import fs from 'fs';
import Rule from './rule';

export default class MarkdownProofing {
  constructor() {
    this.analyzers = [];
    this.rules = [];
  }

  // The `rootDirOverride` parameter helps with testing
  static createUsingConfiguration(configuration, rootDirOverride) {
    const markdownProofing = new MarkdownProofing();

    if (configuration.presets) {
      configuration.presets.forEach(x => {
        const presetFilePath = `${rootDirOverride || __dirname}/presets/${x}.json`;
        const presetConfiguration = JSON.parse(fs.readFileSync(presetFilePath, 'utf-8'));

        this.addAssetsToInstance(
          markdownProofing, presetConfiguration, rootDirOverride);
      });
    }

    this.addAssetsToInstance(
      markdownProofing, configuration, rootDirOverride);

    return markdownProofing;
  }

  static addAssetsToInstance(markdownProofing, configuration, rootDirOverride) {
    if (configuration.analyzers) {
      configuration.analyzers.forEach(x => {
        const analyzer = require(`${rootDirOverride || __dirname}/analyzers/${x}.js`);
        markdownProofing.addAnalyzer(analyzer);
      });
    }

    if (configuration.rules) {
      for (const prop in configuration.rules) {
        const ruleValue = configuration.rules[prop];

        if (ruleValue === 'none') {
          markdownProofing.rules = markdownProofing.rules.filter(
            x => x.messageType !== prop);
        } else {
          markdownProofing.addRule(prop, ruleValue);
        }
      }
    }
  }

  addAnalyzer(analyzer) {
    if (this.analyzers.indexOf(analyzer) === -1) {
      this.analyzers.push(analyzer);
    }

    return this;
  }

  addRule(messageType, ruleCondition) {
    // ruleCondition could be:
    // info, warning < 5, error < 10
    //
    // We should apply each of these as a separate rule.

    const ruleConditions = ruleCondition.split(',').map(x => x.trim());

    ruleConditions.forEach(rc => {
      this.rules.push(new Rule(messageType, rc));
    });

    return this;
  }

  proof(text) {
    const analyzerPromises = [];

    this.analyzers.forEach(X => {
      // Analyzers can return a promise that resolves with an
      // `AnalyzerResult`, or they can simply return an `AnalyzerResult`.
      const resultOrPromise = new X().analyze(text);

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
