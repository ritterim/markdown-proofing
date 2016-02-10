export default class Rule {
  constructor(messageType, condition) {
    this.supportedConditionPrefixes = [
      'error',
      'info',
      'warning'
    ];

    this.supportedOperators = [
      '<',
      '<=',
      '>',
      '>=',
      '=='
    ];

    if (!this.supportedConditionPrefixes.some(x => condition.startsWith(x))) {
      throw new Error(`Unsupported configuration condition: '${condition}'`);
    }

    this.messageType = messageType;
    this.condition = condition;
  }

  _getOperator(condition) {
    // Order comparisons by length of text strings descending
    const orderedSupportedOperators = this.supportedOperators
      .slice()
      .sort((a, b) => b.length - a.length);

    let output;
    orderedSupportedOperators.forEach(x => {
      if (condition.includes(x)) {
        output = x;
      }
    });

    if (output) {
      return output;
    }

    throw new Error(`Unable to determine comparison operator from condition '${this.condition}'`);
  }

  _getComparisonValue(condition) {
    const matches = condition.match(/\d+$/gi);
    const comparisonValue = Number(matches[matches.length - 1]);

    return comparisonValue;
  }

  matchesCondition(analyzerMessage) {
    if (/* isNumericRule: */ this.supportedOperators.some(x => this.condition.includes(x))) {
      const operator = this._getOperator(this.condition);
      const comparisonValue = this._getComparisonValue(this.condition);

      if (!operator) {
        throw new Error(`Encountered a problem while parsing numeric condition operator: ${operator}`);
      }

/* eslint-disable no-undefined */

      // `0` is a valid comparisonValue value
      if (comparisonValue === undefined || comparisonValue === null) {
        throw new Error(`Encountered a problem while parsing numeric condition value: ${comparisonValue}`);
      }

/* eslint-enable no-undefined */

/* eslint-disable no-eval */

      return analyzerMessage.type === this.messageType
        && eval(`${analyzerMessage.message} ${operator} ${comparisonValue}`);

/* eslint-enable no-eval */
    }

    return analyzerMessage.type === this.messageType;
  }
}
