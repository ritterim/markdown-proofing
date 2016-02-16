import test from 'ava';
import 'babel-core/register';

import PromiseReturningTestAnalyzer from '../../src/lib/analyzers/promise-returning-test-analyzer';

test('Should return no messages when no issues found', t => {
  return new PromiseReturningTestAnalyzer().analyze()
    .then(x => t.is(x.messages.length, 0));
});
