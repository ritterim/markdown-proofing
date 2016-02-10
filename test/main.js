import test from 'ava';
import 'babel-core/register';

import MarkdownProofing from '../src/lib/main';
import AnalyzerResult from '../src/lib/analyzer-result';
import StatisticsAnalyzer from '../src/lib/analyzers/statistics';

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
  const result = new MarkdownProofing()
    .proof('a');

  t.is(result.messages.length, 0);
});

test('Returns empty messages with one analyzera and no matching configuration', t => {
  const text = 'a';

  const output = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .proof(text);

  t.is(output.messages.length, 0);
});

test('Returns expected single message with one analyzer with matching configuration rule', t => {
  const text = 'a';

  const output = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addRule('test-analyzer-1', 'info')
    .proof(text);

  t.is(output.messages.length, 1);

  t.is(output.messages[0].type, 'test-analyzer-1');
  t.is(output.messages[0].message, 'test-analyzer-1 message.');
});

test('Returns expected one message from two analyzers with one matching configuration rules', t => {
  const text = 'a';

  const output = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .proof(text);

  t.is(output.messages.length, 1);

  t.is(output.messages[0].type, 'test-analyzer-1');
  t.is(output.messages[0].message, 'test-analyzer-1 message.');
});

test('Returns expected two messages from two analyzers with two matching configuration rules', t => {
  const text = 'a';

  const output = new MarkdownProofing()
    .addAnalyzer(TestAnalyzer1)
    .addAnalyzer(TestAnalyzer2)
    .addRule('test-analyzer-1', 'info')
    .addRule('test-analyzer-2', 'info')
    .proof(text);

  t.is(output.messages.length, 2);

  t.is(output.messages[0].type, 'test-analyzer-1');
  t.is(output.messages[0].message, 'test-analyzer-1 message.');

  t.is(output.messages[1].type, 'test-analyzer-2');
  t.is(output.messages[1].message, 'test-analyzer-2 message.');
});

test('createUsingConfiguration adds analyzers', t => {
  const configuration = {
    analyzers: [
      'statistics'
    ]
  };

  const requireAnalyzerFunction = () => {
    return new StatisticsAnalyzer();
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, requireAnalyzerFunction);

  t.is(proofing.analyzers.length, 1);
});

test('createUsingConfiguration adds rules', t => {
  const configuration = {
    rules: {
      'statistics-word-count': 'info'
    }
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration);

  t.is(proofing.rules.length, 1);
});

test('createUsingConfiguration presets adds preset analyzers', t => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, null, '/src/lib/presets/');

  t.true(proofing.analyzers.length > 1);
});

test('createUsingConfiguration presets adds preset rules', t => {
  const configuration = {
    presets: [
      'technical-blog'
    ]
  };

  const proofing = MarkdownProofing.createUsingConfiguration(configuration, null, 'src/lib/presets/');

  t.true(proofing.rules.length > 1);
});