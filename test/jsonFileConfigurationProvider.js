import test from 'ava';
import path from 'path';

import JsonFileConfigurationProvider from '../src/lib/jsonFileConfigurationProvider';

test('Constructor should throw for missing filePath', t => {
  t.throws(
    () => new JsonFileConfigurationProvider(),
    'filePath must be provided.');
});

test('Configuration should set filePath', t => {
  const testFilePath = 'test.json';

  const provider = new JsonFileConfigurationProvider(testFilePath);

  t.is(provider.filePath, testFilePath);
});

test('getConfiguration should throw if file does not exist', t => {
  const testFilePath = 'test.json';

  const provider = new JsonFileConfigurationProvider(testFilePath);

  t.throws(() => provider.getConfiguration(), /ENOENT: no such file or directory/);
});

test('getConfiguration should throw for invalid JSON', t => {
  const testFilePath = path.resolve(__dirname, '../test/fixtures/invalidConfiguration.json');

  const provider = new JsonFileConfigurationProvider(testFilePath);

  t.throws(() => provider.getConfiguration(), 'Unexpected token T');
});

test('getConfiguration should return expected configuration when valid JSON', t => {
  const testFilePath = path.resolve(__dirname, '../test/fixtures/validConfiguration.json');

  const provider = new JsonFileConfigurationProvider(testFilePath);

  const configuration = provider.getConfiguration();

  t.is(configuration.analyzers.length, 1);
  t.is(configuration.analyzers[0], 'spelling');

  t.is(configuration.rules['spelling-error'], 'error');
});
