import path from 'path';

import JsonFileConfigurationProvider from '../src/lib/jsonFileConfigurationProvider';

test('Constructor should throw for missing filePath', () => {
  expect(() => new JsonFileConfigurationProvider()).toThrowError('filePath must be provided.');
});

test('Configuration should set filePath', () => {
  const testFilePath = 'test.json';

  const provider = new JsonFileConfigurationProvider(testFilePath);

  expect(provider.filePath).toBe(testFilePath);
});

test('getConfiguration should throw if file does not exist', () => {
  const testFilePath = 'test.json';

  const provider = new JsonFileConfigurationProvider(testFilePath);

  expect(() => provider.getConfiguration()).toThrowError(/ENOENT: no such file or directory/);
});

test('getConfiguration should throw for invalid JSON', () => {
  const testFilePath = path.resolve(__dirname, '../tests/fixtures/invalidConfiguration.json');

  const provider = new JsonFileConfigurationProvider(testFilePath);

  expect(() => provider.getConfiguration()).toThrowError(/Unexpected token T/);
});

test('getConfiguration should return expected configuration when valid JSON', () => {
  const testFilePath = path.resolve(__dirname, '../tests/fixtures/validConfiguration.json');

  const provider = new JsonFileConfigurationProvider(testFilePath);

  const configuration = provider.getConfiguration();

  expect(configuration.analyzers.length).toBe(1);
  expect(configuration.analyzers[0]).toBe('spelling');

  expect(configuration.rules['spelling-error']).toBe('error');
});
