import AnalyzerResult from './analyzer-result';
import writeGood from 'write-good';

export default class WriteGoodAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const suggestions = writeGood(str);

    result.addMessage(
      'write-good-suggestions-count',
      suggestions.length);

    if (suggestions.length > 0) {
      result.addMessage(
        'write-good-suggestions-details',
        suggestions.map(x => x.reason).join(', '));
    }

    return result;
  }
}
