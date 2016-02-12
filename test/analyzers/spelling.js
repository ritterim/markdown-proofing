import test from 'ava';
import 'babel-core/register';

import SpellingAnalyzer from '../../src/lib/analyzers/spelling';

test('Returns spelling-error for one spelling error', t => {
  const text = 'abc123';

  const result = new SpellingAnalyzer().analyze(text);

  t.is(result.messages.length, 1);
  t.is(result.getMessage('spelling-error').message, `'${text}' does not match a known dictionary word.`);
});
