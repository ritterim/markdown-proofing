import test from 'ava';

import Validator from '../src/lib/validator';

test('isValidMessageType returns true when valid', t => {
  const messageType = 'valid-message-1';

  const result = Validator.isValidMessageType(messageType);

  t.true(result);
});

test('isValidMessageType returns false when invalid', t => {
  const messageType = 'invalid message';

  const result = Validator.isValidMessageType(messageType);

  t.false(result);
});

test('isValidMessageType returns false when empty', t => {
  const messageType = '';

  const result = Validator.isValidMessageType(messageType);

  t.false(result);
});

test('ensureValidMessageType should not throw when valid', t => {
  const messageType = 'valid-message-1';

  Validator.ensureValidMessageType(messageType);

  t.pass();
});

test('ensureValidMessageType should throw when invalid', t => {
  const messageType = 'invalid message';

  t.throws(
    () => Validator.ensureValidMessageType(messageType),
    `${messageType} is not a valid message type.`);
});

test('ensureValidMessageType should throw when empty', t => {
  const messageType = '';

  t.throws(
    () => Validator.ensureValidMessageType(messageType),
    `${messageType} is not a valid message type.`);
});
