import test from 'ava';

import FillersAnalyzer from '../../src/lib/analyzers/fillers';
const messageType = 'filler-words-usage-counts';

test('Uses expected message type', t => {
  const text = 'actual';

  const result = new FillersAnalyzer().analyze(text);

  t.is(result.messages[0].type, messageType);
});

test('Uses expected fillers', t => {
  const text = 'actual';

  const result = new FillersAnalyzer().analyze(text);

  t.is(result.getMessage(messageType).text, 'actual: 1');
});
