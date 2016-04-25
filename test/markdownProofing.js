import test from 'ava';
import path from 'path';

import MarkdownProofing from '../src/lib/markdownProofing';
import AnalyzerResult from '../src/lib/analyzer-result';

const rootDirOverride = path.join(__dirname, '/../src/lib');

class TestAnalyzer1 {
  analyze(/* str */) {
    const result = new AnalyzerResult();

    result.addMessage('test-analyzer-1', 'test-analyzer-1 message.');

    return result;
  }
}

class TestAnalyzer2 {
  analyze(/* str */) {
    const result = new AnalyzerResult();

    result.addMessage('test-analyzer-2', 'test-analyzer-2 message.');

    return result;
  }
}

test('Returns empty messages when no analyzers', t => {
  return new MarkdownProofing()
    .proof('a')
    .then(result => t.is(result.messages.length, 0));
});

test('Returns empty messages with one analyzer and no matching configuration', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .proof(text)
    .then(result => t.is(result.messages.length, 0));
});

test('Returns expected single message with one analyzer with matching configuration rule', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      t.is(result.messages.length, 1);

      t.is(result.messages[0].type, 'test-analyzer-1');
      t.is(result.messages[0].text, 'test-analyzer-1 message.');
    });
});

test('Returns expected single message with one analyzer added twice with matching configuration rule', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      t.is(result.messages.length, 1);

      t.is(result.messages[0].type, 'test-analyzer-1');
      t.is(result.messages[0].text, 'test-analyzer-1 message.');
    });
});

test('Returns expected single message from two analyzers with one matching configuration rules', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      t.is(result.messages.length, 1);

      t.is(result.messages[0].type, 'test-analyzer-1');
      t.is(result.messages[0].text, 'test-analyzer-1 message.');
    });
});

test('Returns expected two messages from two analyzers with two matching configuration rules', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .addRule('test-analyzer-2', 'info')
    .proof(text)
    .then(result => {
      t.is(result.messages.length, 2);

      t.is(result.messages[0].type, 'test-analyzer-1');
      t.is(result.messages[0].text, 'test-analyzer-1 message.');

      t.is(result.messages[1].type, 'test-analyzer-2');
      t.is(result.messages[1].text, 'test-analyzer-2 message.');
    });
});

test('Returns single message for multiple rule conditions', t => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info, warning')
    .proof(text)
    .then(result => {
      t.is(result.messages.length, 1);
      t.is(result.messages[0].type, 'test-analyzer-1');
    });
});

test('Sets two rules when comma seperated', t => {
  const sut = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info, warning < 10');

  t.is(sut.rules.length, 2);
  t.is(sut.rules[0].condition, 'info');
  t.is(sut.rules[1].condition, 'warning < 10');
});

test('createUsingConfiguration adds analyzers', t => {
  const configuration = {
    analyzers: [
      'spelling',
      'statistics'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  t.is(proofing.analyzers.length, 2);
});

test('createUsingConfiguration adds rules', t => {
  const configuration = {
    rules: {
      'statistics-word-count': 'info'
    }
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  t.is(proofing.rules.length, 1);
});

test('createUsingConfiguration presets adds preset analyzers', t => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  t.true(proofing.analyzers.length > 1);
});

test('createUsingConfiguration presets adds preset rules', t => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  t.true(proofing.rules.length > 1);
});

test('createUsingConfiguration removes rules from preset with none', t => {
  const configuration = {
    presets: [
      'technical-blog'
    ],
    rules: {
      'spelling-error': 'none'
    }
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  t.false(proofing.rules.some(x => x.messageType === 'spelling-error'));
});
