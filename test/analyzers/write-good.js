import test from 'ava';
import 'babel-core/register';

import WriteGoodAnalyzer from '../../src/lib/analyzers/write-good';

test('Should return one message when no issues found', t => {
  const text = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(result.messages.length, 1);
});

test('Should return expected write-good-suggestions-count for no issues found', t => {
  const text = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(result.getMessage('write-good-suggestions-count').message, 0);
});

test('Should return expected write-good-suggestions-count for repeated word', t => {
  const text = 'the the';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(result.getMessage('write-good-suggestions-count').message, 1);
});

test('Should return expected write-good-suggestions-details for repeated word', t => {
  const text = 'the the';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(
    result.getMessage('write-good-suggestions-details').message,
    '"the" is repeated');
});

test('Should return expected write-good-suggestions-count for multiple repeated words', t => {
  const text = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(result.getMessage('write-good-suggestions-count').message, 2);
});

test('Should return expected write-good-suggestions-details for multiple repeated words', t => {
  const text = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(text);

  t.is(
    result.getMessage('write-good-suggestions-details').message,
    '"the" is repeated, "test" is repeated');
});
