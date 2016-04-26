import test from 'ava';
import chalk from 'chalk';
import path from 'path';

import Main from '../src/lib/main';

class TestConfigurationProvider {
  constructor(configuration) {
    this.configuration = configuration;
  }

  getConfiguration() {
    return this.configuration;
  }
}

class TestLogger {
  constructor() {
    this.messages = [];
  }

  log(message) {
    this.messages.push(message);
  }
}

function getMain(configuration, flags) {
  return new Main(
    [path.resolve(__dirname, '../test/fixtures/2015-12-20-announcing-rimdev-releases.md')],
    flags || {},
    new TestConfigurationProvider(configuration),
    new TestLogger());
}

test('Returns expected error when warning exists applying error first', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error, warning' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[error] statistics-word-count : 198');
  });
});

test('Returns expected error when warning exists applying warning first', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning, error' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[error] statistics-word-count : 198');
  });
});

test('Returns expected error when info rule condition exists', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error, info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[error] statistics-word-count : 198');
  });
});

test('Returns expected warning when info rule exists', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning, info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[warning] statistics-word-count : 198');
  });
});

test('Returns expected info rule condition', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[info] statistics-word-count : 198');
  });
});

test('Throws error for unexpected rule condition', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'invalid-condition' }
  };

  const main = getMain(configuration);

  t.throws(
    () => main._displayResults(
      'test.md',
      [configuration.rules],
      {
        messages: [
          {
            type: 'statistics-word-count',
            text: 198
          }
        ]
      }),
    'An unexpected error occurred: The applicableRules did not match any of the handled conditions.');
});

test('Does not use colors when no colors specified', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration);

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], '[error] statistics-word-count : 198');
  });
});

test('Shows red for error when color specified', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], chalk.red('[error] statistics-word-count : 198'));
  });
});

test('Shows yellow for warning when color specified', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], chalk.yellow('[warning] statistics-word-count : 198'));
  });
});

test('Shows blue for info when color specified', t => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'info' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    t.is(main.logger.messages.length, 2); // First message is the file printout
    t.is(main.logger.messages[1], chalk.blue('[info] statistics-word-count : 198'));
  });
});
