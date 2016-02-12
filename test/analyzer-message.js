import test from 'ava';
import 'babel-core/register';

import AnalyzerMessage from '../src/lib/analyzer-message';

test('Constructor sets type', t => {
  const testType = 'test-type-1';

  const result = new AnalyzerMessage(testType);

  t.is(result.type, testType);
});

test('Constructor sets message', t => {
  const testMessage = 'Test message.';

  const result = new AnalyzerMessage('test-type-1', testMessage);

  t.is(result.message, testMessage);
});

test('Constructor sets line', t => {
  const testLine = 2;

  const result = new AnalyzerMessage('test-type-1', 'Test message.', testLine);

  t.is(result.line, testLine);
});

test('Constructor sets offset', t => {
  const testOffset = 7;

  const result = new AnalyzerMessage('test-type-1', 'Test message.', 2, testOffset);

  t.is(result.offset, testOffset);
});

test('Constructor throws for invalid type', t => {
  t.throws(() => new AnalyzerMessage('invalid type'));
});
