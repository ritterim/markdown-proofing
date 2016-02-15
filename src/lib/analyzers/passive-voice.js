import AnalyzerResult from '../analyzer-result';
import passive from 'passive-voice';

export default class PassiveVoiceAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const passiveResult = passive(str/* , { by: true } */);

    result.addMessage('passive-voice-usage-count', passiveResult.length);

    return result;
  }
}
