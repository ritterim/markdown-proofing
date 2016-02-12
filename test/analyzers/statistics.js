import test from 'ava';
import 'babel-core/register';

import StatisticsAnalyzer from '../../src/lib/analyzers/statistics';

const text = 'This is an example sentence.';
const result = new StatisticsAnalyzer().analyze(text);

test('Returns statistics-text-length', t => {
  t.is(result.getMessage('statistics-text-length').message, text.length + 1);
});

test('Returns statistics-letter-count', t => {
  t.is(result.getMessage('statistics-letter-count').message, 23);
});

test('Returns statistics-sentence-count', t => {
  t.is(result.getMessage('statistics-sentence-count').message, 2);
});

test('Returns statistics-word-count', t => {
  t.is(result.getMessage('statistics-word-count').message, 6);
});

test('Returns statistics-average-words-per-sentence', t => {
  t.is(result.getMessage('statistics-average-words-per-sentence').message, 3);
});

test('Returns statistics-average-syllables-per-word', t => {
  t.is(result.getMessage('statistics-average-syllables-per-word').message, 1.33);
});

test('Returns statistics-words-with-three-syllables', t => {
  t.is(result.getMessage('statistics-words-with-three-syllables').message, 1);
});

test('Returns statistics-percentage-words-with-three-syllables', t => {
  t.is(result.getMessage('statistics-percentage-words-with-three-syllables').message, 16.67);
});

test('Returns statistics-flesch-kincaid-reading-ease', t => {
  t.is(result.getMessage('statistics-flesch-kincaid-reading-ease').message, 91);
});

test('Returns statistics-flesch-kincaid-grade-level', t => {
  t.is(result.getMessage('statistics-flesch-kincaid-grade-level').message, 1.3);
});

test('Returns statistics-gunning-fog-score', t => {
  t.is(result.getMessage('statistics-gunning-fog-score').message, 7.9);
});

test('Returns statistics-coleman-liau-index', t => {
  t.is(result.getMessage('statistics-coleman-liau-index').message, 6.7);
});

test('Returns statistics-smog-index', t => {
  t.is(result.getMessage('statistics-smog-index').message, 4.4);
});

test('Returns statistics-automated-readability-index', t => {
  t.is(result.getMessage('statistics-automated-readability-index').message, -1.9);
});
