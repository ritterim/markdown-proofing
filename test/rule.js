import test from 'ava';
import 'babel-core/register';

import AnalyzerMessage from '../src/lib/analyzers/analyzer-message';
import Rule from '../src/lib/rule';

const testMessageType = 'test-message-type';
const testCondition = 'info';
const testNumericLessThan10Condition = 'info < 10';

test('Constructor sets messageType', t => {
  const result = new Rule(testMessageType, 'info');

  t.is(result.messageType, testMessageType);
});

test('Constructor sets condition', t => {
  const result = new Rule('test-message-type', testCondition);

  t.is(result.condition, testCondition);
});

test('Constructor throws with expected message for invalid condition', t => {
  t.throws(
    () => new Rule('test-message-type', 'invalid-condition'),
    `Unsupported configuration condition: 'invalid-condition'`);
});

test('Constructor throws with expected message for numeric invalid condition', t => {
  t.throws(
    () => new Rule('test-message-type', 'invalid-condition < 10'),
    `Unsupported configuration condition: 'invalid-condition < 10'`);
});

test('matchesCondition returns true when message type match', t => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 'test-message');
  const rule = new Rule(testMessageType, testCondition);

  const result = rule.matchesCondition(analyzerMessage);

  t.is(result, true);
});

test('matchesCondition returns false when no message type match', t => {
  const analyzerMessage = new AnalyzerMessage('non-matching-message-type', 'test-message');
  const rule = new Rule(testMessageType, testCondition);

  const result = rule.matchesCondition(analyzerMessage);

  t.is(result, false);
});

test('matchesCondition returns true when message type match inside numeric allowance', t => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 5);
  const rule = new Rule(testMessageType, testNumericLessThan10Condition);

  const result = rule.matchesCondition(analyzerMessage);

  t.is(result, true);
});

test('matchesCondition returns false when message type match outside numeric allowance', t => {
  const analyzerMessage = new AnalyzerMessage(testMessageType, 15);
  const rule = new Rule(testMessageType, testNumericLessThan10Condition);

  const result = rule.matchesCondition(analyzerMessage);

  t.is(result, false);
});
