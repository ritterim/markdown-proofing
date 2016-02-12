import AnalyzerMessage from './analyzer-message';

export default class AnalyzerResult {
  constructor() {
    this.messages = [];
  }

  addMessage(type, message) {
    this.messages.push(new AnalyzerMessage(type, message));
  }

  getMessage(type) {
    const analyzerMessage = this.messages.find(x => x.type === type);

    if (analyzerMessage) {
      return analyzerMessage.message;
    }

    return null;
  }
}
