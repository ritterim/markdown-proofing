export default class MarkdownProofing {
  constructor() {
    this.analyzers = [];
    this.options = {};
  }

  addAnalyzer(analyzer) {
    this.analyzers.push(analyzer);

    return this;
  }

  addConfiguration(key, value) {
    const allowedConfigurationValues = [
      'error',
      'info',
      'warning'
    ];

    if (!allowedConfigurationValues.includes(value)) {
      throw new Error(
        `Invalid configuration value: '${value}'. `
        + `Valid values are: ${allowedConfigurationValues.join(', ')}.`);
    }

    this.options[key] = value;

    return this;
  }

  proof(text) {
    const analyzerMessages = [];

    this.analyzers.forEach(X => {
      const result = new X().analyze(text);

      // Flatten the messages returned by all analyzers into a single collection
      result.messages.forEach(
        x => analyzerMessages.push({ type: x.type, message: x.message }));
    });

    analyzerMessages.sort((a, b) => a.type.localeCompare(b.type));

    return {
      messages: analyzerMessages
    };
  }
}
