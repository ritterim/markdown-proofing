import test from 'ava';
import 'babel-core/register';

import StatisticsAnalyzer from '../../src/lib/analyzers/statistics';

const text = 'This is an example sentence.';
const result = new StatisticsAnalyzer().analyze(text);

test('Returns statistics-text-length', t => {
  t.is(result.getMessage('statistics-text-length').text, text.length + 1);
});

test('Returns statistics-letter-count', t => {
  t.is(result.getMessage('statistics-letter-count').text, 23);
});

test('Returns statistics-sentence-count', t => {
  t.is(result.getMessage('statistics-sentence-count').text, 2);
});

test('Returns statistics-word-count', t => {
  t.is(result.getMessage('statistics-word-count').text, 6);
});

test('Returns statistics-average-words-per-sentence', t => {
  t.is(result.getMessage('statistics-average-words-per-sentence').text, 3);
});

test('Returns statistics-average-syllables-per-word', t => {
  t.is(result.getMessage('statistics-average-syllables-per-word').text, 1.33);
});

test('Returns statistics-words-with-three-syllables', t => {
  t.is(result.getMessage('statistics-words-with-three-syllables').text, 1);
});

test('Returns statistics-percentage-words-with-three-syllables', t => {
  t.is(result.getMessage('statistics-percentage-words-with-three-syllables').text, 16.67);
});

test('Returns statistics-flesch-kincaid-reading-ease', t => {
  t.is(result.getMessage('statistics-flesch-kincaid-reading-ease').text, 91);
});

test('Returns statistics-flesch-kincaid-grade-level', t => {
  t.is(result.getMessage('statistics-flesch-kincaid-grade-level').text, 1.3);
});

test('Returns statistics-gunning-fog-score', t => {
  t.is(result.getMessage('statistics-gunning-fog-score').text, 7.9);
});

test('Returns statistics-coleman-liau-index', t => {
  t.is(result.getMessage('statistics-coleman-liau-index').text, 6.7);
});

test('Returns statistics-smog-index', t => {
  t.is(result.getMessage('statistics-smog-index').text, 4.4);
});

test('Returns statistics-automated-readability-index', t => {
  t.is(result.getMessage('statistics-automated-readability-index').text, -1.9);
});
