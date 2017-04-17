import FillersAnalyzer from '../../src/lib/analyzers/fillers';
const messageType = 'filler-words-usage-counts';

test('Uses expected message type', () => {
  const text = 'actual';

  const result = new FillersAnalyzer().analyze(text);

  expect(result.messages[0].type).toBe(messageType);
});

test('Uses expected fillers', () => {
  const text = 'actual';

  const result = new FillersAnalyzer().analyze(text);

  expect(result.getMessage(messageType).text).toBe('actual: 1');
});
