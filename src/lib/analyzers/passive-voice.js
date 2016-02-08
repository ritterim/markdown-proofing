import AnalyzerResult from './analyzer-result';
import passive from 'passive-voice';

export default class PassiveVoiceAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const passiveResult = passive(str/* , { by: true } */);

    if (passiveResult.length > 0) {
      result.addMessage('passive-voice-usage-count', passiveResult.length);
    }

    return result;
  }
}
