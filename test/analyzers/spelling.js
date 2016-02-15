import test from 'ava';
import 'babel-core/register';

import SpellingAnalyzer from '../../src/lib/analyzers/spelling';

test('Returns spelling-error for one spelling error', t => {
  const testText = 'abc123';

  const result = new SpellingAnalyzer().analyze(testText);

  t.is(result.messages.length, 1);
  t.is(result.getMessage('spelling-error').text, 'abc123');
});

test('Returns two spelling-error messages for two spelling errors', t => {
  const testText = 'abc123 abc123';

  const result = new SpellingAnalyzer().analyze(testText);

  t.is(result.messages.length, 2);
  t.true(result.messages.every(x => x.text === 'abc123'));
});

test('Should return expected line number', t => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = new SpellingAnalyzer().analyze(testText);

  t.is(result.getMessage('spelling-error').line, 4);
});

test('Should return expected offset', t => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = new SpellingAnalyzer().analyze(testText);

  t.is(result.getMessage('spelling-error').offset, 15);
});
