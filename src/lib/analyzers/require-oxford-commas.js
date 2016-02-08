import AnalyzerResult from './analyzer-result';
import { isMissingOxfordCommas } from 'ensure-oxford-commas';

export default class RequireOxfordCommasAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    if (isMissingOxfordCommas(str)) {
      result.addMessage('missing-oxford-commas', 'One or more Oxford commas are missing.');
    }

    return result;
  }
}
