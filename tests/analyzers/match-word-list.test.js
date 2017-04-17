import MatchWordListAnalyzer from '../../src/lib/analyzers/match-word-list';

const messageType = 'test-message-type';

class TestMatchWordListAnalyzer extends MatchWordListAnalyzer {
  constructor(matchWords) {
    super(messageType, matchWords);
  }
}

test('No message when no matching words used', () => {
  const text = 'This is a test.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  expect(result.messages.length).toBe(0);
});

test('Expected text when one match words used', () => {
  const text = 'This is an apple.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  expect(result.getMessage(messageType).text).toBe('apple: 1');
});

test('Expected text when same match word used more than once', () => {
  const text = 'This is an apple. This is an apple.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  expect(result.getMessage(messageType).text).toBe('apple: 2');
});

test('Expected text when multiple match words used', () => {
  const text = 'This is an apple. This is an orange.';

  const result = new TestMatchWordListAnalyzer(['apple', 'orange'])
    .analyze(text);

  expect(result.getMessage(messageType).text).toBe('apple: 1, orange: 1');
});

test('Displays match words by usage count then alphabetically ', () => {
  const text = 'This is a watermelon. This is a watermelon. This is an apple. This is an orange. This is an orange.';

  const result = new TestMatchWordListAnalyzer(['apple', 'orange', 'watermelon']).analyze(text);

  expect(result.getMessage(messageType).text).toBe('orange: 2, watermelon: 2, apple: 1');
});

test('Matches match words in a case insensitive manner', () => {
  const text = 'This is an appLe.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  expect(result.getMessage(messageType).text).toBe('apple: 1');
});
