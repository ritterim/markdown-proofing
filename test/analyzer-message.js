import test from 'ava';
import 'babel-core/register';

import AnalyzerMessage from '../src/lib/analyzer-message';

test('Constructor sets type', t => {
  const testType = 'test-type-1';

  const result = new AnalyzerMessage(testType);

  t.is(result.type, testType);
});

test('Constructor sets text', t => {
  const testText = 'Test text.';

  const result = new AnalyzerMessage('test-type-1', testText);

  t.is(result.text, testText);
});

test('Constructor sets line', t => {
  const testLine = 2;

  const result = new AnalyzerMessage('test-type-1', 'Test text.', testLine);

  t.is(result.line, testLine);
});

test('Constructor sets column', t => {
  const testColumn = 7;

  const result = new AnalyzerMessage('test-type-1', 'Test text.', 2, testColumn);

  t.is(result.column, testColumn);
});

test('Constructor throws for invalid type', t => {
  t.throws(() => new AnalyzerMessage('invalid type'));
});
