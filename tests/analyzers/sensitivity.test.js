import SensitivityAnalyzer from '../../src/lib/analyzers/sensitivity';

test('Should return no messages when no issues found', () => {
  const text = 'Hi!';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.messages.length).toBe(0);
});

test('Should return expected text for single usage', () => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.getMessage('sensitivity').text).toBe('`pop` may be insensitive, use `parent` instead');
});

test('Should return expected text for multiple usages', () => {
  const text = 'Someone asked pop what time it is. Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.messages.length).toBe(2);

  expect(result.messages[0].text).toBe('`pop` may be insensitive, use `parent` instead');

  expect(result.messages[1].text).toBe('`pop` may be insensitive, use `parent` instead');
});

test('Should return expected line number', () => {
  const text = '\n\nSomeone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.getMessage('sensitivity').line).toBe(3);
});

test('Should return expected column', () => {
  const text = 'Someone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.getMessage('sensitivity').column).toBe(15);
});

test('Should return expected column when potential issue not on first line', () => {
  const text = 'This is a test.\n\nSomeone asked pop what time it is.';

  const result = new SensitivityAnalyzer().analyze(text);

  expect(result.getMessage('sensitivity').column).toBe(15);
});
