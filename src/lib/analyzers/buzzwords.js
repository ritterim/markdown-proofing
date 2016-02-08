import MatchWordListAnalyzer from './match-word-list';
import buzzwords from 'buzzwords';

export default class BuzzwordsAnalyzer extends MatchWordListAnalyzer {
  constructor() {
    super('buzzword-usage-counts', buzzwords);
  }
}
