import test from 'ava';

import Location from '../src/lib/location';

test('Should return expected line number', t => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = Location.getLine(testText, /* index: */ 6);

  t.is(result, 4);
});

test('Should return expected line column', t => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = Location.getLineColumn(testText, /* index: */ 21);

  t.is(result, 16);
});
