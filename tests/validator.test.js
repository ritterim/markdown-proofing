import Validator from '../src/lib/validator';

test('isValidMessageType returns true when valid', () => {
  const messageType = 'valid-message-1';

  const result = Validator.isValidMessageType(messageType);

  expect(result).toBe(true);
});

test('isValidMessageType returns false when invalid', () => {
  const messageType = 'invalid message';

  const result = Validator.isValidMessageType(messageType);

  expect(result).toBe(false);
});

test('isValidMessageType returns false when empty', () => {
  const messageType = '';

  const result = Validator.isValidMessageType(messageType);

  expect(result).toBe(false);
});

test('ensureValidMessageType should not throw when valid', () => {
  const messageType = 'valid-message-1';

  Validator.ensureValidMessageType(messageType);
});

test('ensureValidMessageType should throw when invalid', () => {
  const messageType = 'invalid message';

  expect(() => Validator.ensureValidMessageType(messageType)).toThrowError(`${messageType} is not a valid message type.`);
});

test('ensureValidMessageType should throw when empty', () => {
  const messageType = '';

  expect(() => Validator.ensureValidMessageType(messageType)).toThrowError(`${messageType} is not a valid message type.`);
});
