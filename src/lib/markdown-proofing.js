import Rule from './rule';

export default class MarkdownProofing {
  constructor() {
    this.analyzers = [];
    this.rules = [];
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

    this.analyzers.forEach(X => {
      const result = new X().analyze(text);

      const applicableMessages = result.messages.filter(
        message => this.rules.some(rule => rule.matchesCondition(message)));

      applicableMessages.forEach(
        x => analyzerMessages.push({ type: x.type, message: x.message }));
    });

    analyzerMessages.sort((a, b) => a.type.localeCompare(b.type));

    return {
      messages: analyzerMessages
    };
  }
}
