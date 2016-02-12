import Validator from './validator';

export default class AnalyzerMessage {
  constructor(type, message, line, offset) {
    Validator.ensureValidMessageType(type);

    this.type = type;
    this.message = message;
    this.line = line;
    this.offset = offset;
  }
}
