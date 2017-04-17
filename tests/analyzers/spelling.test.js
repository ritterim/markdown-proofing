import SpellingAnalyzer from '../../src/lib/analyzers/spelling';

beforeEach(() => {
  SpellingAnalyzer.initialized = false;
});

test('Returns spelling-error for one spelling error', () => {
  const testText = 'abc123';

  new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      expect(result.messages.length).toBe(1);
      expect(result.getMessage('spelling-error').text).toBe('abc123');
    });
});

test('Returns two spelling-error messages for two spelling errors', () => {
  const testText = 'abc123 abc123';

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      expect(result.messages.length).toBe(2);
      expect(result.messages.every(x => x.text === 'abc123')).toBe(true);
    });
});

test('Should return expected line number', () => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      expect(result.getMessage('spelling-error').line).toBe(4);
    });
});

test('Should return expected column', () => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      expect(result.getMessage('spelling-error').column).toBe(16);
    });
});

test('Should use spelling configuration file', () => {
  const testText = 'allowedtestword';

  return new SpellingAnalyzer({ configurationFile: '../../.spelling' })
    .analyze(testText)
    .then(result => {
      expect(result.messages.length).toBe(0);
    });
});

test('Should not be initially initialized', () => {
  expect(SpellingAnalyzer.initialized).toBe(false);
});

test('Should be initialized after initialize invoked', () => {
  const testText = 'abc123';

  expect(SpellingAnalyzer.initialized).toBe(false);

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(() => {
      expect(SpellingAnalyzer.initialized).toBe(true);
    });
});

test('Should be initialized after analyze invoked', () => {
  const testText = 'abc123';

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(() => {
      expect(SpellingAnalyzer.initialized).toBe(true);
    });
});

test('initialize should initially return a promise resolving to false', () => {
  return new SpellingAnalyzer()
    .initialize()
    .then(x => {
      expect(x).toBe(false);
    });
});

test('initialize should return a promise resolving to true after previously invoked', () => {
  const analyzer = new SpellingAnalyzer();

  return analyzer
    .initialize()
    .then(() => {
      analyzer
        .initialize()
        .then(x => {
          expect(x).toBe(true);
        });
    });
});
