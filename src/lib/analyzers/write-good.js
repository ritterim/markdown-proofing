import AnalyzerResult from '../analyzer-result';
import writeGood from 'write-good';

export default class WriteGoodAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const suggestions = writeGood(str);

    suggestions.forEach(x => {
      result.addMessage(
        'write-good-suggestion',
        x.reason,
        WriteGoodAnalyzer.getLine(str, x.index),
        WriteGoodAnalyzer.getLineOffset(str, x.index));
    });

    return result;
  }

  static getLine(str, index) {
    const strPriorToIndex = str.substr(0, index);
    const matchNewLines = strPriorToIndex.match(/\n/g);

    if (matchNewLines && matchNewLines.length > 0) {
      return matchNewLines.length + 1;
    }

    return index;
  }

  static getLineOffset(str, index) {
    const strPriorToIndex = str.substr(0, index);
    const lastNewLineIndex = strPriorToIndex.lastIndexOf('\n');
    return index - lastNewLineIndex - 1;
  }
}
