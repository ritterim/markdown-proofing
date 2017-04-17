import WriteGoodAnalyzer from '../../src/lib/analyzers/write-good';

test('Should return no messages when no issues found', () => {
  const testText = 'Hi!';

  const result = new WriteGoodAnalyzer().analyze(testText);

  expect(result.messages.length).toBe(0);
});

test('Should return expected write-good-suggestion message for repeated word', () => {
  const testText = 'the the';

  const result = new WriteGoodAnalyzer().analyze(testText);

  expect(result.getMessage('write-good-suggestion').text).toBe('"the" is repeated');
});

test('Should return expected write-good-suggestion messages and text for multiple repeated words', () => {
  const testText = 'the the test test';

  const result = new WriteGoodAnalyzer().analyze(testText);

  expect(result.messages.every(x => x.type === 'write-good-suggestion')).toBe(true);

  expect(result.messages[0].text).toBe('"the" is repeated');
  expect(result.messages[1].text).toBe('"test" is repeated');
});

test('Should return expected line number', () => {
  const testText = `1
2
3
This is a test test
This
is
a
test.`;

  const result = new WriteGoodAnalyzer().analyze(testText);

  expect(result.getMessage('write-good-suggestion').line).toBe(4);
});

test('Should return expected column', () => {
  const testText = `1
2
3
This is a test test
This
is
a
test.`;

  const result = new WriteGoodAnalyzer().analyze(testText);

  expect(result.getMessage('write-good-suggestion').column).toBe(16);
});
