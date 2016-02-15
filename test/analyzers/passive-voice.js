import test from 'ava';
import 'babel-core/register';

import PassiveVoiceAnalyzer from '../../src/lib/analyzers/passive-voice';

test('Expected message when no passive voice detected', t => {
  const text = 'They mixed the ingredients.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.getMessage('passive-voice-usage-count').text, 0);
});

test('Expected text when passive voice is detected once', t => {
  const text = 'The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.getMessage('passive-voice-usage-count').text, 1);
});

test('Expected text when passive voice is detected more than once', t => {
  const text = 'The ingredients were mixed well. The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  t.is(result.getMessage('passive-voice-usage-count').text, 2);
});
