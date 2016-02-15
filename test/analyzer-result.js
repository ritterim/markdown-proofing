import test from 'ava';
import 'babel-core/register';

import AnalyzerResult from '../src/lib/analyzer-result';

test('addMessage adds expected message', t => {
  const testMessageType = 'test';
  const testMessageText = 'test-message';
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, testMessageText);

  t.is(result.getMessage(testMessageType).text, testMessageText);
});

test('addMessage adds expected line', t => {
  const testMessageType = 'test';
  const testMessageLine = 3;
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, 'test-message', testMessageLine);

  t.is(result.getMessage(testMessageType).line, testMessageLine);
});

test('addMessage adds expected column', t => {
  const testMessageType = 'test';
  const testMessageColumn = 7;
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, 'test-message', 3, testMessageColumn);

  t.is(result.getMessage(testMessageType).column, testMessageColumn);
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

  const messageText = result.getMessage(testMessageType).text;

  t.is(messageText, testMessageText);
});
