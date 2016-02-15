import AnalyzerResult from '../analyzer-result';
import Location from '../location';
import writeGood from 'write-good';

export default class WriteGoodAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const suggestions = writeGood(str);

    suggestions.forEach(x => {
      result.addMessage(
        'write-good-suggestion',
        x.reason,
        Location.getLine(str, x.index),
        Location.getLineOffset(str, x.index));
    });

    return result;
  }


}
