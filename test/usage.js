import test from 'ava';
import fs from 'fs';

import MarkdownProofing from '../src/lib/main';
import StatisticsAnalyzer from '../src/lib/analyzers/statistics';

const exampleJekyllBlogPost = fs
  .readFileSync('./fixtures/2015-12-20-announcing-rimdev-releases.md')
  .toString();

test('Should read Jekyll markdown blog post string', t => {
  return new MarkdownProofing()
    .proof(exampleJekyllBlogPost)
    .then(() => t.pass());
});

test('Should parse statistics from Jekyll markdown blog post string', t => {
  return new MarkdownProofing()
    .addAnalyzer(StatisticsAnalyzer)
    .addRule('statistics-word-count', 'info')
    .proof(exampleJekyllBlogPost)
    .then(x => t.is(x.messages.length, 1));
});
