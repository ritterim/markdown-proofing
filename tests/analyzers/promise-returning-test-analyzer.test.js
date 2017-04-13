import PromiseReturningTestAnalyzer from '../../src/lib/analyzers/promise-returning-test-analyzer';

test('Should return no messages when no issues found', () => {
  return new PromiseReturningTestAnalyzer().analyze()
    .then(x => expect(x.messages.length).toBe(0));
});
