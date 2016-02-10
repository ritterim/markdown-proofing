export default class Validator {
  static isValidMessageType(messageType) {
    if (!messageType || typeof messageType !== 'string') {
      return false;
    }

    return messageType.match(/[^a-z0-9-]/) === null;
  }

  static ensureValidMessageType(messageType) {
    const isValid = this.isValidMessageType(messageType);

    if (!isValid) {
      throw new Error(`${messageType} is not a valid message type.`);
    }
  }
}
