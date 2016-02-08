import test from 'ava';
import 'babel-core/register';

import BuzzwordsAnalyzer from '../../src/lib/analyzers/buzzwords';
const messageType = 'buzzword-usage-counts';

test('Uses expected message type', t => {
  const text = 'This is an ajax test.';

  const result = new BuzzwordsAnalyzer().analyze(text);

  t.is(result.messages[0].type, messageType);
});

test('Uses expected buzzwords', t => {
  const text = 'This is an ajax test.';

  const result = new BuzzwordsAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'ajax: 1');
});
