import AnalyzerMessage from '../src/lib/analyzer-message';
import Rule from '../src/lib/rule';

const testMessageType = 'test-message-type';
const testCondition = 'info';
const testNumericLessThan10Condition = 'info < 10';

test('Constructor sets messageType', () => {
  const result = new Rule(testMessageType, 'info');

  expect(result.messageType).toBe(testMessageType);
});

test('Constructor sets condition', () => {
  const result = new Rule('test-message-type', testCondition);

  expect(result.condition).toBe(testCondition);
});

test('Constructor throws with expected message for invalid condition', () => {
  expect(() => new Rule('test-message-type', 'invalid-condition')).toThrowError('Unsupported configuration condition: \'invalid-condition\'');
});

test('Constructor throws with expected message for numeric invalid condition', () => {
  expect(() => new Rule('test-message-type', 'invalid-condition < 10')).toThrowError('Unsupported configuration condition: \'invalid-condition < 10\'');
});

test('matchesCondition returns true when message type match', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 'test-message');
  const rule = new Rule(testMessageType, testCondition);

  const result = rule.matchesCondition(analyzerMessage);

  expect(result).toBe(true);
});

test('matchesCondition returns false when no message type match', () => {
  const analyzerMessage = new AnalyzerMessage('non-matching-message-type', 'test-message');
  const rule = new Rule(testMessageType, testCondition);

  const result = rule.matchesCondition(analyzerMessage);

  expect(result).toBe(false);
});

test('matchesCondition returns true when message type match inside numeric allowance', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 5);
  const rule = new Rule(testMessageType, testNumericLessThan10Condition);

  const result = rule.matchesCondition(analyzerMessage);

  expect(result).toBe(true);
});

test('matchesCondition returns false when message type match outside numeric allowance', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 15);
  const rule = new Rule(testMessageType, testNumericLessThan10Condition);

  const result = rule.matchesCondition(analyzerMessage);

  expect(result).toBe(false);
});

test('matchesCondition throws when invalid operator used', () => {
  const testInvalidCondition = 'error LT 3';

  const analyzerMessage = new AnalyzerMessage(testMessageType, 15);
  const rule = new Rule(testMessageType, testInvalidCondition);

  expect(() => rule.matchesCondition(analyzerMessage)).toThrowError(`Invalid condition specified: ${testInvalidCondition}`);
});

test('matchesCondition should work with less than condition', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 1);
  const rule = new Rule(testMessageType, 'warning < 2');

  expect(rule.matchesCondition(analyzerMessage)).toBe(true);
});

test('matchesCondition should work with less than or equal to condition', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 2);
  const rule = new Rule(testMessageType, 'warning <= 2');

  expect(rule.matchesCondition(analyzerMessage)).toBe(true);
});

test('matchesCondition should work with equal to than condition', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 2);
  const rule = new Rule(testMessageType, 'warning == 2');

  expect(rule.matchesCondition(analyzerMessage)).toBe(true);
});

test('matchesCondition should work with greater than or equal to condition', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 2);
  const rule = new Rule(testMessageType, 'warning >= 2');

  expect(rule.matchesCondition(analyzerMessage)).toBe(true);
});

test('matchesCondition should work with greater than condition', () => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 3);
  const rule = new Rule(testMessageType, 'warning > 2');

  expect(rule.matchesCondition(analyzerMessage)).toBe(true);
});
