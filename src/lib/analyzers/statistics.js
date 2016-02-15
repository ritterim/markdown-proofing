import textStatistics from 'text-statistics';
import roundTo from 'round-to';
import AnalyzerResult from '../analyzer-result';

export default class StatisticsAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    const strNoYamlFrontMatter = str.replace(/^\n*-{3}(.|\n)*-{3}\n*/, '');

    const stats = textStatistics(strNoYamlFrontMatter || new String());
    const statsFullTextContent = textStatistics(str);

    const addMessage = (messageType, numericValue) => {
      result.addMessage(messageType, roundTo(numericValue, 2));
    };

    //
    // General statistics
    //

    addMessage('statistics-text-length', statsFullTextContent.textLength());
    addMessage('statistics-letter-count', stats.letterCount());
    addMessage('statistics-sentence-count', stats.sentenceCount());
    addMessage('statistics-word-count', stats.wordCount());
    addMessage('statistics-average-words-per-sentence', stats.averageWordsPerSentence());
    addMessage('statistics-average-syllables-per-word', stats.averageSyllablesPerWord());
    addMessage('statistics-words-with-three-syllables', stats.wordsWithThreeSyllables());
    addMessage('statistics-percentage-words-with-three-syllables', stats.percentageWordsWithThreeSyllables());

    //
    // Readability
    //

    // https://en.wikipedia.org/wiki/Flesch–Kincaid_readability_tests
    addMessage('statistics-flesch-kincaid-reading-ease', stats.fleschKincaidReadingEase());
    addMessage('statistics-flesch-kincaid-grade-level', stats.fleschKincaidGradeLevel());

    // https://en.wikipedia.org/wiki/Gunning_fog_index
    addMessage('statistics-gunning-fog-score', stats.gunningFogScore());

    // https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index
    addMessage('statistics-coleman-liau-index', stats.colemanLiauIndex());

    // https://en.wikipedia.org/wiki/SMOG
    addMessage('statistics-smog-index', stats.smogIndex());

    // https://en.wikipedia.org/wiki/Automated_readability_index
    addMessage('statistics-automated-readability-index', stats.automatedReadabilityIndex());

    return result;
  }
}
