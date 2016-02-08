import MatchWordListAnalyzer from './match-word-list';
import fillers from 'fillers';

export default class FillersAnalyzer extends MatchWordListAnalyzer {
  constructor() {
    super('filler-words-usage-counts', fillers);
  }
}
