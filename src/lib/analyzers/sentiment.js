import AnalyzerResult from './analyzer-result';
import sentiment from 'sentiment';

export default class SentimentAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();
    const sentimentResult = sentiment(str);

    result.addMessage('sentiment-score', `Score: ${sentimentResult.score}`);

    // Explanation of comparative:
    // https://github.com/thisandagain/sentiment/issues/20
    result.addMessage('sentiment-comparative-score', `Comparative Score: ${sentimentResult.comparative}`);

    return result;
  }
}
