import Validator from './validator';

export default class AnalyzerMessage {
  constructor(type, text, line, offset) {
    Validator.ensureValidMessageType(type);

    this.type = type;
    this.text = text;
    this.line = line;
    this.offset = offset;
  }
}
