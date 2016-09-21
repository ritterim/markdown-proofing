import stripMarkdown from 'strip-markdown';
const remark = require('remark').use(stripMarkdown);

// Use this class for consistency across analyzers
//
// Note: Processing the original text in any manner may change the locations
// (as in, line and column) of characters. This may be applicable when
// reporting on text locations inside analyzers.
export default class TextProcessor {
  static removeYamlFrontMatter(str) {
    return str.replace(/^\n*-{3}(.|\n)*-{3}\n*/, '');
  }

  static markdownToText(str) {
    const preprocessedStr = str
      // Remove empty links
      .replace(/\[\]\(\)/g, '')

      // Remove empty list items
      .replace(/^(-|\*)\s*\n/gm, '');

    return this.removeYamlFrontMatter(remark.process(preprocessedStr));
  }
}
