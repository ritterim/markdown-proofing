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

const inputDefault = [
  path.resolve(__dirname, '../tests/fixtures/2015-12-20-announcing-rimdev-releases.md')
];

const testHelpMessage = 'test-help';

function getMain(configuration, flags = {}, input = inputDefault) {
  const cli = {
    input: input,
    flags: flags,
    help: testHelpMessage
  };

  return new Main(
    cli,
    new TestConfigurationProvider(configuration),
    new TestLogger());
}

test('Sends help message to logger when no files', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'info' }
  };

  const main = getMain(configuration, {}, []);

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(1);
    expect(main.logger.messages[0]).toBe(testHelpMessage);
  });
});

test('Returns expected error when warning exists applying error first', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error, warning' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[error] statistics-word-count : 198');
  });
});

test('Returns expected error when warning exists applying warning first', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning, error' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[error] statistics-word-count : 198');
  });
});

test('Returns expected error when info rule condition exists', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error, info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[error] statistics-word-count : 198');
  });
});

test('Returns expected warning when info rule exists', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning, info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[warning] statistics-word-count : 198');
  });
});

test('Returns expected info rule condition', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'info' }
  };

  const main = getMain(configuration, { 'no-colors': true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[info] statistics-word-count : 198');
  });
});

test('Throws error for unexpected rule condition', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'invalid-condition' }
  };

  const main = getMain(configuration);

  expect(() => main._displayResults(
    'test.md',
    [configuration.rules],
    {
      messages: [
        {
          type: 'statistics-word-count',
          text: 198
        }
      ]
    })).toThrowError('An unexpected error occurred: The applicableRules did not match any of the handled conditions.');
});

test('Does not use colors when no colors specified', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration);

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe('[error] statistics-word-count : 198');
  });
});

test('Shows red for error when color specified', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe(chalk.red('[error] statistics-word-count : 198'));
  });
});

test('Shows yellow for warning when color specified', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'warning' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe(chalk.yellow('[warning] statistics-word-count : 198'));
  });
});

test('Shows blue for info when color specified', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'info' }
  };

  const main = getMain(configuration, { color: true });

  return main.run().then(() => {
    expect(main.logger.messages.length).toBe(2); // First message is the file printout
    expect(main.logger.messages[1]).toBe(chalk.blue('[info] statistics-word-count : 198'));
  });
});

test('Does not throw for proofing errors by default', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration);

  return main.run();
});

test('Throws for one error by default with expected message', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: { 'statistics-word-count': 'error' }
  };

  const main = getMain(configuration, { throw: true });

  return main.run().catch(e => {
    expect(e.message).toBe('1 error was encountered while proofing.');
  });
});

test('Throws for two errors by default with expected message', () => {
  const configuration = {
    analyzers: ['statistics'],
    rules: {
      'statistics-letter-count': 'error',
      'statistics-word-count': 'error'
    }
  };

  const main = getMain(configuration, { throw: true });

  return main.run().catch(e => {
    expect(e.message).toBe('2 errors were encountered while proofing.');
  });
});
