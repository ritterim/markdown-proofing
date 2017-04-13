import BuzzwordsAnalyzer from '../../src/lib/analyzers/buzzwords';
const messageType = 'buzzword-usage-counts';

test('Uses expected message type', () => {
  const text = 'This is an ajax test.';

  const result = new BuzzwordsAnalyzer().analyze(text);

  expect(result.messages[0].type).toBe(messageType);
});

test('Uses expected buzzwords', () => {
  const text = 'This is an ajax test.';

  const result = new BuzzwordsAnalyzer().analyze(text);

  expect(result.getMessage(messageType).text).toBe('ajax: 1');
});
