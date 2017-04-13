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

test('Returns empty messages when no analyzers', () => {
  return new MarkdownProofing()
    .proof('a')
    .then(result => expect(result.messages.length).toBe(0));
});

test('Returns empty messages with one analyzer and no matching configuration', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .proof(text)
    .then(result => expect(result.messages.length).toBe(0));
});

test('Returns expected single message with one analyzer with matching configuration rule', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      expect(result.messages.length).toBe(1);

      expect(result.messages[0].type).toBe('test-analyzer-1');
      expect(result.messages[0].text).toBe('test-analyzer-1 message.');
    });
});

test('Returns expected single message with one analyzer added twice with matching configuration rule', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      expect(result.messages.length).toBe(1);

      expect(result.messages[0].type).toBe('test-analyzer-1');
      expect(result.messages[0].text).toBe('test-analyzer-1 message.');
    });
});

test('Returns expected single message from two analyzers with one matching configuration rules', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .proof(text)
    .then(result => {
      expect(result.messages.length).toBe(1);

      expect(result.messages[0].type).toBe('test-analyzer-1');
      expect(result.messages[0].text).toBe('test-analyzer-1 message.');
    });
});

test('Returns expected two messages from two analyzers with two matching configuration rules', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .addRule('test-analyzer-2', 'info')
    .proof(text)
    .then(result => {
      expect(result.messages.length).toBe(2);

      expect(result.messages[0].type).toBe('test-analyzer-1');
      expect(result.messages[0].text).toBe('test-analyzer-1 message.');

      expect(result.messages[1].type).toBe('test-analyzer-2');
      expect(result.messages[1].text).toBe('test-analyzer-2 message.');
    });
});

test('Returns single message for multiple rule conditions', () => {
  const text = 'a';

  return new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info, warning')
    .proof(text)
    .then(result => {
      expect(result.messages.length).toBe(1);
      expect(result.messages[0].type).toBe('test-analyzer-1');
    });
});

test('Sets two rules when comma seperated', () => {
  const sut = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info, warning < 10');

  expect(sut.rules.length).toBe(2);
  expect(sut.rules[0].condition).toBe('info');
  expect(sut.rules[1].condition).toBe('warning < 10');
});

test('createUsingConfiguration adds analyzers', () => {
  const configuration = {
    analyzers: [
      'spelling',
      'statistics'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  expect(proofing.analyzers.length).toBe(2);
});

test('createUsingConfiguration adds rules', () => {
  const configuration = {
    rules: {
      'statistics-word-count': 'info'
    }
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  expect(proofing.rules.length).toBe(1);
});

test('createUsingConfiguration presets adds preset analyzers', () => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  expect(proofing.analyzers.length > 1).toBe(true);
});

test('createUsingConfiguration presets adds preset rules', () => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  expect(proofing.rules.length > 1).toBe(true);
});

test('createUsingConfiguration removes rules from preset with none', () => {
  const configuration = {
    presets: [
      'technical-blog'
    ],
    rules: {
      'spelling-error': 'none'
    }
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, rootDirOverride);

  expect(proofing.rules.some(x => x.messageType === 'spelling-error')).toBe(false);
});

test('Inline rules override preset rules', () => {
  const configurationBaseline = {
    presets: [
      'inline-rule'
    ]
  };

  const configuration = {
    presets: [
      'inline-rule'
    ],
    rules: {
      'spelling-error': 'info'
    }
  };

  const proofingBaseline = MarkdownProofing.createUsingConfiguration(configurationBaseline, __dirname);
  const proofing = MarkdownProofing.createUsingConfiguration(configuration, __dirname);

  expect(
    proofingBaseline.rules.filter(x => x.messageType === 'spelling-error').length === 1
  ).toBe(true);
  expect(
    proofingBaseline.rules.filter(x => x.messageType === 'spelling-error')[0].condition === 'error'
  ).toBe(true);

  expect(
    proofing.rules.filter(x => x.messageType === 'spelling-error').length === 1
  ).toBe(true);
  expect(
    proofing.rules.filter(x => x.messageType === 'spelling-error')[0].condition === 'info'
  ).toBe(true);
});
