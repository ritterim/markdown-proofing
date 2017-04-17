import PassiveVoiceAnalyzer from '../../src/lib/analyzers/passive-voice';

test('Expected message when no passive voice detected', () => {
  const text = 'They mixed the ingredients.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  expect(result.getMessage('passive-voice-usage-count').text).toBe(0);
});

test('Expected text when passive voice is detected once', () => {
  const text = 'The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  expect(result.getMessage('passive-voice-usage-count').text).toBe(1);
});

test('Expected text when passive voice is detected more than once', () => {
  const text = 'The ingredients were mixed well. The ingredients were mixed well.';

  const result = new PassiveVoiceAnalyzer().analyze(text);

  expect(result.getMessage('passive-voice-usage-count').text).toBe(2);
});
