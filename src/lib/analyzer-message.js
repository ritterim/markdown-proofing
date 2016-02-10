import Validator from './validator';

export default class AnalyzerMessage {
  constructor(type, message) {
    Validator.ensureValidMessageType(type);

    this.type = type;
    this.message = message;
  }
}
