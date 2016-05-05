import test from 'ava';

import SpellingAnalyzer from '../../src/lib/analyzers/spelling';

test('Returns spelling-error for one spelling error', t => {
  const testText = 'abc123';

  new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      t.is(result.messages.length, 1);
      t.is(result.getMessage('spelling-error').text, 'abc123');
    });
});

test('Returns two spelling-error messages for two spelling errors', t => {
  const testText = 'abc123 abc123';

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(result => {
      t.is(result.messages.length, 2);
      t.true(result.messages.every(x => x.text === 'abc123'));
    });
});

test('Should return expected line number', t => {
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
      t.is(result.getMessage('spelling-error').line, 4);
    });
});

test('Should return expected column', t => {
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
      t.is(result.getMessage('spelling-error').column, 16);
    });
});

test('Should use spelling configuration file', t => {
  const testText = 'allowedtestword';

  return new SpellingAnalyzer({ configurationFile: '../../.spelling' })
    .analyze(testText)
    .then(result => {
      t.is(result.messages.length, 0);
    });
});

test('Should not be initially initialized', t => {
  t.false(SpellingAnalyzer.initialized);
});

test('Should be initialized after initialize invoked', t => {
  const testText = 'abc123';

  t.false(SpellingAnalyzer.initialized);

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(() => {
      t.true(SpellingAnalyzer.initialized);
    });
});

test('Should be initialized after analyze invoked', t => {
  const testText = 'abc123';

  return new SpellingAnalyzer()
    .analyze(testText)
    .then(() => {
      t.true(SpellingAnalyzer.initialized);
    });
});

test('initialize should initially return a promise resolving to false', t => {
  return new SpellingAnalyzer()
    .initialize()
    .then(x => {
      t.false(x);
    });
});

test('initialize should return a promise resolving to true after previously invoked', t => {
  const analyzer = new SpellingAnalyzer();

  return analyzer
    .initialize()
    .then(() => {
      analyzer
        .initialize()
        .then(x => {
          t.true(x);
        });
    });
});
