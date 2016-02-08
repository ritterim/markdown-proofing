import MatchWordListAnalyzer from './match-word-list';
import weasels from 'weasels';

export default class WeaselsAnalyzer extends MatchWordListAnalyzer {
  constructor() {
    super('weasel-word-usage-counts', weasels);
  }
}
