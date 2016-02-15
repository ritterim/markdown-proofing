import test from 'ava';
import 'babel-core/register';

import WriteGoodAnalyzer from '../../src/lib/analyzers/write-good';

test('Should return no messages when no issues found', t => {
  const testText = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.messages.length, 0);
});

test('Should return expected write-good-suggestion message for repeated word', t => {
  const testText = 'the the';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(
    result.getMessage('write-good-suggestion').text,
    '"the" is repeated');
});

test('Should return expected write-good-suggestion messages and text for multiple repeated words', t => {
  const testText = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.true(result.messages.every(x => x.type === 'write-good-suggestion'));

  t.is(result.messages[0].text, '"the" is repeated');
  t.is(result.messages[1].text, '"test" is repeated');
});

test('Should return expected line number', t => {
  const testText = `1
2
3
This is a test test
This
is
a
test.`;

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.getMessage('write-good-suggestion').line, 4);
});

test('Should return expected offset', t => {
  const testText = `1
2
3
This is a test test
This
is
a
test.`;

  const result = new WriteGoodAnalyzer().analyze(testText);

  t.is(result.getMessage('write-good-suggestion').offset, 15);
});
