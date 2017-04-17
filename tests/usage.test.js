import fs from 'fs';

import MarkdownProofing from '../src/lib/markdownProofing';
import StatisticsAnalyzer from '../src/lib/analyzers/statistics';

const exampleJekyllBlogPost = fs
  .readFileSync('./tests/fixtures/2015-12-20-announcing-rimdev-releases.md')
  .toString();

test('Should read Jekyll markdown blog post string', () => {
  return new MarkdownProofing()
    .proof(exampleJekyllBlogPost);
});

test('Should parse statistics from Jekyll markdown blog post string', () => {
  return new MarkdownProofing()
    .addAnalyzer(StatisticsAnalyzer)
    .addRule('statistics-word-count', 'info')
    .proof(exampleJekyllBlogPost)
    .then(x => expect(x.messages.length).toBe(1));
});
