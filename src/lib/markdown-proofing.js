import appRootPath from 'app-root-path';
import fs from 'fs';
import Rule from './rule';

export default class MarkdownProofing {
  constructor() {
    this.analyzers = [];
    this.rules = [];
  }

  // The requireAnalyzerFunction and presetFolder parameters help with testing
  static createUsingConfiguration(configuration, requireAnalyzerFunction, presetFolder) {
    if (!presetFolder) {
      presetFolder = '/lib/presets/';
    }

    const markdownProofing = new MarkdownProofing();

    if (configuration.presets) {
      configuration.presets.forEach(x => {
        const presetFilePath = appRootPath.resolve(presetFolder + `${x}.json`);
        const presetConfiguration = JSON.parse(fs.readFileSync(presetFilePath, 'utf-8'));

        this.addAssetsToInstance(
          markdownProofing, presetConfiguration, requireAnalyzerFunction);
      });
    }

    this.addAssetsToInstance(
      markdownProofing, configuration, requireAnalyzerFunction);

    return markdownProofing;
  }

  static addAssetsToInstance(markdownProofing, configuration, requireAnalyzerFunction) {
    if (configuration.analyzers) {
      configuration.analyzers.forEach(x => {
        const analyzer = requireAnalyzerFunction
          ? requireAnalyzerFunction()
          : require(appRootPath.resolve(`lib/analyzers/${x}.js`));

        markdownProofing.addAnalyzer(analyzer);
      });
    }

    if (configuration.rules) {
      for (const prop in configuration.rules) {
        markdownProofing.addRule(prop, configuration.rules[prop]);
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

      applicableMessages.forEach(
        y => analyzerMessages.push({ type: y.type, message: y.message }));
    });

    analyzerMessages.sort((a, b) => a.type.localeCompare(b.type));

    return {
      messages: analyzerMessages
    };
  }
}
