import AnalyzerResult from '../src/lib/analyzer-result';

test('addMessage adds expected message', () => {
  const testMessageType = 'test';
  const testMessageText = 'test-message';
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, testMessageText);

  expect(result.getMessage(testMessageType).text).toBe(testMessageText);
});

test('addMessage adds expected line', () => {
  const testMessageType = 'test';
  const testMessageLine = 3;
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, 'test-message', testMessageLine);

  expect(result.getMessage(testMessageType).line).toBe(testMessageLine);
});

test('addMessage adds expected column', () => {
  const testMessageType = 'test';
  const testMessageColumn = 7;
  const result = new AnalyzerResult();

  result.addMessage(testMessageType, 'test-message', 3, testMessageColumn);

  expect(result.getMessage(testMessageType).column).toBe(testMessageColumn);
});

test('getMessage returns null if message type does not exist', () => {
  const result = new AnalyzerResult();

  const message = result.getMessage('does-not-exist');

  expect(message).toBe(null);
});

test('getMessage returns expected message text if it exists', () => {
  const testMessageType = 'test';
  const testMessageText = 'test-message';

  const result = new AnalyzerResult();
  result.addMessage(testMessageType, testMessageText);

  const messageText = result.getMessage(testMessageType).text;

  expect(messageText).toBe(testMessageText);
});
