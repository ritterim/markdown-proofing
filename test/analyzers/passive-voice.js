import test from 'ava';
import 'babel-core/register';

import PassiveVoiceAnalyzer from '../../src/lib/analyzers/passive-voice';

test('No message when no passive voice used', t => {
  const text = 'They mixed the ingredients.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.messages.length, 0);
});

test('Expected message when passive voice is used once', t => {
  const text = 'The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.getMessage('passive-voice-usage-count'), 1);
});

test('Expected message when passive voice is used more than once', t => {
  const text = 'The ingredients were mixed well. The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.getMessage('passive-voice-usage-count'), 2);
});
