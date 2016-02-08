// https://github.com/sindresorhus/word-list
// https://github.com/zeke/an-array-of-english-words

// https://github.com/nathanjsweet/nodehun

import AnalyzerResult from './analyzer-result';

export default class SpellingAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    if (str.includes('abc123')) {
      result.addMessage('spelling-error', `'abc123' does not match a known dictionary word.`);
    }

    return result;
  }
}
