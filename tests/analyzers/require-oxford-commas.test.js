import RequireOxfordCommasAnalyzer from '../../src/lib/analyzers/require-oxford-commas';

test('No messages when no Oxford comma needed', () => {
  const text = 'a';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  expect(result.messages.length).toBe(0);
});

test('No messages when Oxford comma included', () => {
  const text = 'Please choose between red, green, and blue.';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  expect(result.messages.length).toBe(0);
});

test('Returns missing-oxford-commas', () => {
  const text = 'Please choose between red, green and blue.';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  expect(result.messages.length).toBe(1);
  expect(result.getMessage('missing-oxford-commas').text).toBe('One or more Oxford commas are missing.');
});
