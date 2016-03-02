import AnalyzerResult from '../analyzer-result';
import alex from 'alex';

export default class SensitivityAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    // Based on https://github.com/wooorm/alex/blob/fe844b3448e201757427e2a1179c7c88c4f551f7/readme.md
    // removing any markdown elements may be unnecessary.
    const alexResult = alex.markdown(str);

    alexResult.messages.forEach(x => {
      result.addMessage(
        'sensitivity',
        x.message,
        x.line,
        x.column);
    });

    return result;
  }
}
