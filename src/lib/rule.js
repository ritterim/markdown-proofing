import Validator from './validator';

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

    Validator.ensureValidMessageType(messageType);

    if (!this.supportedConditionPrefixes.some(x => condition.startsWith(x))) {
      throw new Error(`Unsupported configuration condition: '${condition}'`);
    }

    this.messageType = messageType;
    this.condition = condition;
  }

  _getOperator() {
    // Order comparisons by length of text strings descending
    const orderedSupportedOperators = this.supportedOperators
      .slice()
      .sort((a, b) => b.length - a.length);

    let output;
    orderedSupportedOperators.forEach(x => {
      if (this.condition.includes(x)) {
        output = x;
      }
    });

    return output;
  }

  _getComparisonValue() {
    const matches = this.condition.match(/\d+$/gi);
    const comparisonValue = Number(matches[matches.length - 1]);

    return comparisonValue;
  }

  matchesCondition(analyzerMessage) {
    // If this rule is a numeric rule
    // use the operator and comparison value
    // during the matchesCondition check.
    if (this.supportedOperators.some(x => this.condition.includes(x))) {
      const operator = this._getOperator();
      if (!operator) {
        throw new Error(`Encountered a problem while parsing numeric condition operator from: ${this.condition}`);
      }

      const comparisonValue = this._getComparisonValue();

/* eslint-disable no-undefined */

      // `0` is a valid `comparisonValue` value
      if (comparisonValue === undefined || comparisonValue === null) {
        throw new Error(`Encountered a problem while parsing numeric condition value from: ${this.condition}`);
      }

/* eslint-enable no-undefined */

/* eslint-disable no-eval */

      return analyzerMessage.type === this.messageType
        && eval(`${analyzerMessage.text} ${operator} ${comparisonValue}`);

/* eslint-enable no-eval */

    } else if (!this.supportedConditionPrefixes.some(x => x === this.condition)) {
      // If non-numeric comparison, ensure matches
      // one of the valid message types exactly.
      throw new Error(`Invalid condition specified: ${this.condition}`);
    }

    return analyzerMessage.type === this.messageType;
  }
}
