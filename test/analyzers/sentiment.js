import test from 'ava';

import SentimentAnalyzer from '../../src/lib/analyzers/sentiment';

const text = 'This is awesome!';

test('Returns sentiment-score', t => {
  const result = new SentimentAnalyzer().analyze(text);
  t.is(result.getMessage('sentiment-score').text, 4);
});

test('Returns sentiment-comparative-score', t => {
  const result = new SentimentAnalyzer().analyze(text);
  t.is(result.getMessage('sentiment-comparative-score').text, 1.33);
});
