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
    return this
      .initialize()
      .then(() => {
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
      });
  }

  // The returned Promise resolves to `true` if initialization
  // was not required (as in, it already took place).
  // `false` is returned if initialization was ran.
  initialize() {
    return new Promise(resolve => {
      if (SpellingAnalyzer.initialized) {
        resolve(SpellingAnalyzer.initialized);
      } else {
        spellConfig.initialise(this.configurationFile, () => {
          spellcheck.initialise(opts);

          spellConfig
            .getGlobalWords()
            .forEach(x => spellcheck.addWord(x, /* temporary: */ true));

          SpellingAnalyzer.initialized = true;

          resolve(!SpellingAnalyzer.initialized);
        });
      }
    });
  }
}

SpellingAnalyzer.initialized = false;
