import Validator from './validator';

export default class AnalyzerMessage {
  constructor(type, text, line, column) {
    Validator.ensureValidMessageType(type);

    this.type = type;
    this.text = text;
    this.line = line;
    this.column = column;
  }
}
