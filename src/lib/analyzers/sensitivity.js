import AnalyzerResult from '../analyzer-result';
import alex from 'alex';

export default class SensitivityAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const alexResult = alex.markdown(str);

    alexResult.messages.forEach(x => {
      result.addMessage(
        'sensitivity',
        x.message,
        x.line,
        x.column - 1);
    });

    return result;
  }
}
