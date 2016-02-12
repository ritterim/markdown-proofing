import test from 'ava';
import 'babel-core/register';

import AnalyzerResult from '../src/lib/analyzer-result';

test('addMessage adds expected message', t => {
  const testMessageType = 'test';
  const testMessageText = 'test-message';
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, testMessageText);

  t.is(result.getMessage(testMessageType), testMessageText);

  // TODO: Add tests for line and offset after changing what getMessage returns
});

test('getMessage returns null if message type does not exist', t => {
  const result = new AnalyzerResult();

  const message = result.getMessage('does-not-exist');

  t.is(message, null);
});

test('getMessage returns expected message text if it exists', t => {
  const testMessageType = 'test';
  const testMessageText = 'test-message';

  const result = new AnalyzerResult();
  result.addMessage(testMessageType, testMessageText);

  const message = result.getMessage(testMessageType);

  t.is(message, testMessageText);
});
