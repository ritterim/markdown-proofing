import test from 'ava';
import 'babel-core/register';

import SensitivityAnalyzer from '../../src/lib/analyzers/sensitivity';

test('Should return no messages when no issues found', t => {
  const text = 'Hi!';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.messages.length, 0);
});

test('Should return expected text for single usage', t => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(
    result.getMessage('sensitivity').text,
    '`pop` may be insensitive, use `parent` instead');
});

test('Should return expected text for multiple usages', t => {
  const text = 'Someone asked pop what time it is. Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.messages.length, 2);

  t.is(
    result.messages[0].text,
    '`pop` may be insensitive, use `parent` instead');

  t.is(
    result.messages[1].text,
    '`pop` may be insensitive, use `parent` instead');
});

test('Should return expected line number', t => {
  const text = '\n\nSomeone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity').line, 3);
});

test('Should return expected column', t => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity').column, 15);
});

test('Should return expected column when potential issue not on first line', t => {
  const text = 'This is a test.\n\nSomeone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity').column, 15);
});
