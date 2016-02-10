import AnalyzerResult from '../analyzer-result';
import alex from 'alex';

export default class SensitivityAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const alexResult = alex.markdown(str);

    result.addMessage(
      'sensitivity-issues-count',
      alexResult.messages.length);

    if (alexResult.messages.length > 0) {
      result.addMessage(
        'sensitivity-issues-details',
        alexResult.messages.map(x => x.message).join(', '));
    }

    return result;
  }
}
