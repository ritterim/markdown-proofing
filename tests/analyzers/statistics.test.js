import StatisticsAnalyzer from '../../src/lib/analyzers/statistics';

const text = 'This is an example sentence.';
const yamlText = `---
layout: post
title: "Testing"
---`;

test('Returns statistics-text-length', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-text-length').text).toBe(text.length + 1);
});

test('Returns statistics-letter-count', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-letter-count').text).toBe(23);
});

test('Returns statistics-sentence-count', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-sentence-count').text).toBe(2);
});

test('Returns statistics-word-count', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-word-count').text).toBe(6);
});

test('Returns statistics-average-words-per-sentence', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-average-words-per-sentence').text).toBe(3);
});

test('Returns statistics-average-syllables-per-word', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-average-syllables-per-word').text).toBe(1.33);
});

test('Returns statistics-words-with-three-syllables', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-words-with-three-syllables').text).toBe(1);
});

test('Returns statistics-percentage-words-with-three-syllables', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-percentage-words-with-three-syllables').text).toBe(16.67);
});

test('Returns statistics-flesch-kincaid-reading-ease', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-flesch-kincaid-reading-ease').text).toBe(91);
});

test('Returns statistics-flesch-kincaid-grade-level', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-flesch-kincaid-grade-level').text).toBe(1.3);
});

test('Returns statistics-gunning-fog-score', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-gunning-fog-score').text).toBe(7.9);
});

test('Returns statistics-coleman-liau-index', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-coleman-liau-index').text).toBe(6.7);
});

test('Returns statistics-smog-index', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-smog-index').text).toBe(4.4);
});

test('Returns statistics-automated-readability-index', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-automated-readability-index').text).toBe(-1.9);
});

test('Returns statistics-estimated-read-time', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-estimated-read-time').text).toBe('Less than a minute');
});

test('Returns statistics-estimated-read-time-minutes', () => {
  const result = new StatisticsAnalyzer().analyze(text);

  expect(result.getMessage('statistics-estimated-read-time-minutes').text).toBe(0);
});

test('Ignores YAML front matter in all except statistics-text-length', () => {
  const initialValues = new StatisticsAnalyzer().analyze('');

  const result = new StatisticsAnalyzer().analyze(yamlText);

  const applicableMessages = result.messages
    .filter(x => x.type !== 'statistics-text-length');

  // console.log(applicableMessages.map(x => x.type
  //   + ' : '
  //   + x.text
  //   + ' : '
  //   + initialValues.messages.find(y => y.type === x.type).text));

  expect(applicableMessages.every(
    x => x.text === initialValues.messages
      .find(y => x.type === y.type)
    .text)).toBe(true);
});

test('Does not ignore YAML front matter for statistics-text-length', () => {
  const result = new StatisticsAnalyzer().analyze(yamlText);

  expect(result.getMessage('statistics-text-length').text).toBe(yamlText.length);
});
