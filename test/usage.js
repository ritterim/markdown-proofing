import test from 'ava';
import 'babel-core/register';
import fs from 'fs';

import MarkdownProofing from '../src/lib/markdown-proofing';
import StatisticsAnalyzer from '../src/lib/analyzers/statistics';

const exampleJekyllBlogPost = fs
  .readFileSync('./fixtures/2015-12-20-announcing-rimdev-releases.md')
  .toString();

test('Should read Jekyll markdown blog post string', t => {
  new MarkdownProofing()
    .proof(exampleJekyllBlogPost);

  t.pass();
});

test('Should parse statistics from Jekyll markdown blog post string', t => {
  const result = new MarkdownProofing()
    .addAnalyzer(StatisticsAnalyzer)
    .addRule('statistics-word-count', 'info')
    .proof(exampleJekyllBlogPost);

  t.is(result.messages.length, 1);
});
