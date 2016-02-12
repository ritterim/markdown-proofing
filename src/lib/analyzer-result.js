import AnalyzerMessage from './analyzer-message';

export default class AnalyzerResult {
  constructor() {
    this.messages = [];
  }

  addMessage(type, message, line, offset) {
    this.messages.push(new AnalyzerMessage(type, message, line, offset));
  }

  getMessage(type) {
    const analyzerMessage = this.messages.find(x => x.type === type);

    if (analyzerMessage) {
      return analyzerMessage.message;
    }

    return null;
  }
}
