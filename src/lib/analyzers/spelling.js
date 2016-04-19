import AnalyzerResult from '../analyzer-result';
import Location from '../location';
import markdownSpellcheck from 'markdown-spellcheck';

const opts = {
  ignoreAcronyms: true,
  ignoreNumbers: true,
  suggestions: false,
  dictionary: {
    language: 'en-us'
  }
};

export default class SpellingAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const spellResult = markdownSpellcheck.spell(str, opts);

    spellResult.forEach(x => {
      result.addMessage(
        'spelling-error',
        x.word,
        Location.getLine(str, x.index),
        Location.getLineColumn(str, x.index));
    });

    return result;
  }
}
