// This could be removed in the future when this project
// incorporates one or more analyzers that use this behavior.

import AnalyzerResult from '../analyzer-result';

export default class PromiseReturningTestAnalyzer {
  analyze() {
    const result = new AnalyzerResult();

    return Promise.resolve(result);
  }
}
