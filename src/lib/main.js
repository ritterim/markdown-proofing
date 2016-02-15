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
    const analyzerMessages = [];

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

      const result = new CurrentAnalyzer().analyze(text);

      const applicableMessages = result.messages.filter(
        message => this.rules.some(rule => rule.matchesCondition(message)));

      applicableMessages.forEach(y => analyzerMessages.push({
        type: y.type,
        text: y.text,
        line: y.line,
        column: y.column
      }));
    });

    analyzerMessages.sort((a, b) => a.type.localeCompare(b.type));

    return {
      messages: analyzerMessages
    };
  }
}
