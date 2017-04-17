import AnalyzerMessage from '../src/lib/analyzer-message';

test('Constructor sets type', () => {
  const testType = 'test-type-1';

  const result = new AnalyzerMessage(testType);

  expect(result.type).toBe(testType);
});

test('Constructor sets text', () => {
  const testText = 'Test text.';

  const result = new AnalyzerMessage('test-type-1', testText);

  expect(result.text).toBe(testText);
});

test('Constructor sets line', () => {
  const testLine = 2;

  const result = new AnalyzerMessage('test-type-1', 'Test text.', testLine);

  expect(result.line).toBe(testLine);
});

test('Constructor sets column', () => {
  const testColumn = 7;

  const result = new AnalyzerMessage('test-type-1', 'Test text.', 2, testColumn);

  expect(result.column).toBe(testColumn);
});

test('Constructor throws for invalid type', () => {
  expect(() => new AnalyzerMessage('invalid type')).toThrow();
});
