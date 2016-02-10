import test from 'ava';
import 'babel-core/register';

import SentimentAnalyzer from '../../src/lib/analyzers/sentiment';

const text = 'This is awesome!';

test('Returns sentiment-score', t => {
  const result = new SentimentAnalyzer().analyze(text);
  t.is(result.getMessage('sentiment-score'), 4);
});

test('Returns sentiment-comparative-score', t => {
  const result = new SentimentAnalyzer().analyze(text);
  t.is(result.getMessage('sentiment-comparative-score'), 1.3333333333333333);
});
