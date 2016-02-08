import test from 'ava';
import 'babel-core/register';

import WeaselWordsAnalyzer from '../../src/lib/analyzers/weasel-words';
const messageType = 'weasel-word-usage-counts';

test('Uses expected message type', t => {
  const text = 'A lot';

  const result = new WeaselWordsAnalyzer().analyze(text);

  t.is(result.messages[0].type, messageType);
});

test('Uses expected weasel words', t => {
  const text = 'A lot';

  const result = new WeaselWordsAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'a lot: 1');
});
