import test from 'ava';
import 'babel-core/register';

import SensitivityAnalyzer from '../../src/lib/analyzers/sensitivity';

test('Should return one message when no issues found', t => {
  const text = 'Hi!';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.messages.length, 1);
});

test('Should return expected sensitivity-issues-count for no issues found', t => {
  const text = 'Hi!';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity-issues-count').message, 0);
});

test('Should return expected sensitivity-issues-count for single usage of pop, rather than parent', t => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity-issues-count').message, 1);
});

test('Should return expected sensitivity-issues-details for single usage of pop, rather than parent', t => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(
    result.getMessage('sensitivity-issues-details').message,
    '`pop` may be insensitive, use `parent` instead');
});

test('Should return expected sensitivity-issues-count for multiple usages of pop, rather than parent', t => {
  const text = 'Someone asked pop what time it is. Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(result.getMessage('sensitivity-issues-count').message, 2);
});

test('Should return expected sensitivity-issues-details for multiple usages of pop, rather than parent', t => {
  const text = 'Someone asked pop what time it is. Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  t.is(
    result.getMessage('sensitivity-issues-details').message,
    '`pop` may be insensitive, use `parent` instead, `pop` may be insensitive, use `parent` instead');
});
