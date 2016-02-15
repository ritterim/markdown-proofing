import AnalyzerMessage from './analyzer-message';

export default class AnalyzerResult {
  constructor() {
    this.messages = [];
  }

  addMessage(type, text, line, column) {
    this.messages.push(new AnalyzerMessage(type, text, line, column));
  }

  getMessage(type) {
    return this.messages.find(x => x.type === type) || null;
  }
}
