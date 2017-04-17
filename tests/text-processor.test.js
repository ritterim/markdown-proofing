import TextProcessor from '../src/lib/text-processor';

test('removeYamlFrontMatter does not change text with no YAML front matter', () => {
  const text = 'This is a test.';

  const result = TextProcessor.removeYamlFrontMatter(text);

  expect(result).toBe(text);
});

test('removeYamlFrontMatter removes YAML front matter', () => {
  const text = `---
title: "Test Title"
---

This is a test.`;

  const result = TextProcessor.removeYamlFrontMatter(text);

  expect(result).toBe('This is a test.');
});

test('markdownToText adds trailing newline if one is not provided', () => {
  // This test is to document the observed behavior.

  const text = 'This is a test.';

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe(`${text}\n`);
});

test('markdownToText does not modify simple non-markdown text', () => {
  const text = 'This is a test.\n';

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe(text);
});

test('markdownToText maintains only one trailing new line', () => {
  const text = `This is a test.


`;

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe('This is a test.\n');
});

test('markdownToText removes markdown formatting', () => {
  const text = '_This_ **is** `a` test.\n';

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe('This is a test.\n');
});

test('markdownToText removes YAML front matter', () => {
  const text = `---
title: "Test Title"
---

This is a test.
`;

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe('This is a test.\n');
});

test('markdownToText handles blank links', () => {
  const text = `---
title: "Test Title"
---

[]()
[]()
`;

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe('');
});

test('markdownToText handles empty list items', () => {
  // text includes list items with empty links, too.
  const text = `---
title: "Test Title"
---

-
*
- []()
* []()
-
*
`;

  const result = TextProcessor.markdownToText(text);

  expect(result).toBe('');
});
