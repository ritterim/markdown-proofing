import AnalyzerResult from '../analyzer-result';
import Location from '../location';
import writeGood from 'write-good';

export default class WriteGoodAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    // Based on https://github.com/btford/write-good/blob/master/README.md#cli
    // removing any markdown elements may be unnecessary.
    const suggestions = writeGood(str);

    suggestions.forEach(x => {
      result.addMessage(
        'write-good-suggestion',
        x.reason,
        Location.getLine(str, x.index),
        Location.getLineColumn(str, x.index));
    });

    return result;
  }
}
