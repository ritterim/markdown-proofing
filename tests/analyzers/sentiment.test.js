import SentimentAnalyzer from '../../src/lib/analyzers/sentiment';

const text = 'This is awesome!';

test('Returns sentiment-score', () => {
  const result = new SentimentAnalyzer().analyze(text);
  expect(result.getMessage('sentiment-score').text).toBe(4);
});

test('Returns sentiment-comparative-score', () => {
  const result = new SentimentAnalyzer().analyze(text);
  expect(result.getMessage('sentiment-comparative-score').text).toBe(1.33);
});
