import fs from 'fs';

export default class JsonFileConfigurationProvider {
  constructor(filePath) {
    if (!filePath) {
      throw new Error('filePath must be provided.');
    }

    this.filePath = filePath;
  }

  getConfiguration() {
    return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
  }
}
