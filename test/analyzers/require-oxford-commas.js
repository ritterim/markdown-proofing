import test from 'ava';
import 'babel-core/register';

import RequireOxfordCommasAnalyzer from '../../src/lib/analyzers/require-oxford-commas';

test('No messages when no Oxford comma needed', t => {
  const text = 'a';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  t.is(result.messages.length, 0);
});

test('No messages when Oxford comma included', t => {
  const text = 'Please choose between red, green, and blue.';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  t.is(result.messages.length, 0);
});

test('Returns missing-oxford-commas', t => {
  const text = 'Please choose between red, green and blue.';

  const result = new RequireOxfordCommasAnalyzer().analyze(text);

  t.is(result.messages.length, 1);
  t.is(result.getMessage('missing-oxford-commas').message, 'One or more Oxford commas are missing.');
});
