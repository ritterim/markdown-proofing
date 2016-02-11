import test from 'ava';
import 'babel-core/register';

import MatchWordListAnalyzer from '../../src/lib/analyzers/match-word-list';

const messageType = 'test-message-type';

class TestMatchWordListAnalyzer extends MatchWordListAnalyzer {
  constructor(matchWords) {
    super(messageType, matchWords);
  }
}

test('No message when no matching words used', t => {
  const text = 'This is a test.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  t.is(result.messages.length, 0);
});

test('Expected message when one match words used', t => {
  const text = 'This is an apple.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1');
});

test('Expected message when same match word used more than once', t => {
  const text = 'This is an apple. This is an apple.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  t.is(result.getMessage(messageType), 'apple: 2');
});

test('Expected message when multiple match words used', t => {
  const text = 'This is an apple. This is an orange.';

  const result = new TestMatchWordListAnalyzer(['apple', 'orange'])
    .analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1, orange: 1');
});

test('Displays match words by usage count then alphabetically ', t => {
  const text = 'This is a watermelon. This is a watermelon. This is an apple. This is an orange. This is an orange.';

  const result = new TestMatchWordListAnalyzer(['apple', 'orange', 'watermelon']).analyze(text);

  t.is(result.getMessage(messageType), 'orange: 2, watermelon: 2, apple: 1');
});

test('Matches match words in a case insensitive manner', t => {
  const text = 'This is an appLe.';

  const result = new TestMatchWordListAnalyzer(['apple'])
    .analyze(text);

  t.is(result.getMessage(messageType), 'apple: 1');
});
