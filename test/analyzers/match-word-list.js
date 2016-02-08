import test from 'ava';
import 'babel-core/register';

import MatchWordListAnalyzer from '../../src/lib/analyzers/match-word-list';

const messageType = 'test-message-type';

class TestMatchWordListAnalyzer extends MatchWordListAnalyzer {
  constructor() {
    super(messageType, ['apple', 'orange']);
  }
}

test('No message when no matching words used', t => {
  const text = 'This is a test.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.messages.length, 0);
});

test('Expected message when one buzzword used', t => {
  const text = 'This is an apple.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1');
});

test('Expected message when same buzzword used more than once', t => {
  const text = 'This is an apple. This is an apple.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'apple: 2');
});

test('Expected message when multiple buzzwords used', t => {
  const text = 'This is an apple. This is an orange.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1, orange: 1');
});

test('Displays buzzwords alphabetically', t => {
  const text = 'This is an orange. This is an apple.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1, orange: 1');
});

test('Matches buzzwords in a case insensitive manner', t => {
  const text = 'This is an appLe.';

  const result = new TestMatchWordListAnalyzer().analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1');
});
