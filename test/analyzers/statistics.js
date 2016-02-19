import test from 'ava';
import 'babel-core/register';

import StatisticsAnalyzer from '../../src/lib/analyzers/statistics';

const text = 'This is an example sentence.';
const yamlText = `---
layout: post
title: "Testing"
---`;

test('Returns statistics-text-length', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-text-length').text, text.length + 1);
});

test('Returns statistics-letter-count', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-letter-count').text, 23);
});

test('Returns statistics-sentence-count', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-sentence-count').text, 2);
});

test('Returns statistics-word-count', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-word-count').text, 6);
});

test('Returns statistics-average-words-per-sentence', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-average-words-per-sentence').text, 3);
});

test('Returns statistics-average-syllables-per-word', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-average-syllables-per-word').text, 1.33);
});

test('Returns statistics-words-with-three-syllables', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-words-with-three-syllables').text, 1);
});

test('Returns statistics-percentage-words-with-three-syllables', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-percentage-words-with-three-syllables').text, 16.67);
});

test('Returns statistics-flesch-kincaid-reading-ease', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-flesch-kincaid-reading-ease').text, 91);
});

test('Returns statistics-flesch-kincaid-grade-level', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-flesch-kincaid-grade-level').text, 1.3);
});

test('Returns statistics-gunning-fog-score', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-gunning-fog-score').text, 7.9);
});

test('Returns statistics-coleman-liau-index', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-coleman-liau-index').text, 6.7);
});

test('Returns statistics-smog-index', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-smog-index').text, 4.4);
});

test('Returns statistics-automated-readability-index', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-automated-readability-index').text, -1.9);
});

test('Returns statistics-estimated-read-time', t => {
  const result = new StatisticsAnalyzer().analyze(text);

  t.is(result.getMessage('statistics-estimated-read-time').text, 'Less than a minute');
});

test('Ignores YAML front matter in all except statistics-text-length', t => {
  const initialValues = new StatisticsAnalyzer().analyze('');

  const result = new StatisticsAnalyzer().analyze(yamlText);

  const applicableMessages = result.messages
    .filter(x => x.type !== 'statistics-text-length');

  t.true(applicableMessages.every(
    x => x.text === initialValues.messages
      .find(y => x.type === y.type)
    .text));
});

test('Does not ignore YAML front matter for statistics-text-length', t => {
  const result = new StatisticsAnalyzer().analyze(yamlText);

  t.is(result.getMessage('statistics-text-length').text, yamlText.length);
});
