export default class Location {
  static getLine(str, index) {
    const strPriorToIndex = str.substr(0, index);
    const matchNewLines = strPriorToIndex.match(/\n/g);

    if (matchNewLines && matchNewLines.length > 0) {
      return matchNewLines.length + 1;
    }

    return index;
  }

  static getLineOffset(str, index) {
    const strPriorToIndex = str.substr(0, index);
    const lastNewLineIndex = strPriorToIndex.lastIndexOf('\n');
    return index - lastNewLineIndex - 1;
  }
}
