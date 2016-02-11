import AnalyzerResult from '../analyzer-result';

export default class MatchWordListAnalyzer {
  constructor(messageType, words) {
    this.messageType = messageType;
    this.words = words;
  }

  analyze(str) {
    const result = new AnalyzerResult();
    const usages = [];

    // Populate usages object with counts of usages
    this.words.forEach(x => {
      const regExp = new RegExp(x, 'gi');
      const matches = str.match(regExp);

      if (matches && matches.length > 0) {
        const prop = matches[0].toLowerCase();

        usages.push({
          word: prop,
          count: matches.length
        });
      }
    });

    usages.sort((a, b) => b.count - a.count);

    const messageItems = usages.map(usage => `${usage.word}: ${usage.count}`);

    if (messageItems.length > 0) {
      result.addMessage(this.messageType, messageItems.join(', '));
    }

    return result;
  }
}
