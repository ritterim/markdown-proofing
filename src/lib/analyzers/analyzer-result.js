import AnalyzerMessage from './analyzer-message';

export default class AnalyzerResult {
  constructor() {
    this.messages = [];
  }

  addMessage(type, message) {
    if (this.messages.some(x => x.type === type)) {
      throw new Error('A message of this type was already added.');
    }

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
