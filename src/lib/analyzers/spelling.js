import AnalyzerResult from '../analyzer-result';
import Location from '../location';
import markdownSpellcheck from 'markdown-spellcheck';
import spellConfig from 'markdown-spellcheck/es5/spell-config';
import spellcheck from 'markdown-spellcheck/es5/spellcheck';

const opts = {
  ignoreAcronyms: true,
  ignoreNumbers: true,
  suggestions: false,
  dictionary: {
    language: 'en-us'
  }
};

export default class SpellingAnalyzer {
  constructor(args = { configurationFile: './.spelling' }) {
    this.configurationFile = args.configurationFile;
  }

  analyze(str) {
    return new Promise(resolve => {
      spellConfig.initialise(this.configurationFile, () => {
        const result = new AnalyzerResult();

        spellcheck.initialise(opts);

        spellConfig
          .getGlobalWords()
          .forEach(x => spellcheck.addWord(x, /* temporary: */ true));

        const spellResult = markdownSpellcheck.spell(str, opts);

        spellResult.forEach(x => {
          result.addMessage(
            'spelling-error',
            x.word,
            Location.getLine(str, x.index),
            Location.getLineColumn(str, x.index));
        });

        resolve(result);
      });
    });
  }
}
