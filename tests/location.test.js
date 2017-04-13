import Location from '../src/lib/location';

test('Should return expected line number', () => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = Location.getLine(testText, /* index: */ 6);

  expect(result).toBe(4);
});

test('Should return expected line column', () => {
  const testText = `1
2
3
This is a test abc123
This
is
a
test.`;

  const result = Location.getLineColumn(testText, /* index: */ 21);

  expect(result).toBe(16);
});
