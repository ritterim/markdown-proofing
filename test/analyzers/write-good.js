import test from 'ava';
import 'babel-core/register';

import WriteGoodAnalyzer from '../../src/lib/analyzers/write-good';

test('Should return one message when no issues found', t => {
  const testText = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.messages.length, 1);
});

test('Should return expected write-good-suggestions-count for no issues found', t => {
  const testText = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.getMessage('write-good-suggestions-count').text, 0);
});

test('Should return expected write-good-suggestions-count for repeated word', t => {
  const testText = 'the the';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.getMessage('write-good-suggestions-count').text, 1);
});

test('Should return expected write-good-suggestions-details for repeated word', t => {
  const testText = 'the the';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(
    result.getMessage('write-good-suggestions-details').text,
    '"the" is repeated');
});

test('Should return expected write-good-suggestions-count for multiple repeated words', t => {
  const testText = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.getMessage('write-good-suggestions-count').text, 2);
});

test('Should return expected write-good-suggestions-details for multiple repeated words', t => {
  const testText = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(
    result.getMessage('write-good-suggestions-details').text,
    '"the" is repeated, "test" is repeated');
});
