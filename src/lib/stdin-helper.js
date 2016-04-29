import fs from 'fs';

export default class StdinHelper {
  readAllSync() {
    if (process.stdin.isTTY) {
      return null;
    }

    // Adapted from http://stackoverflow.com/a/9318276
    process.stdin.resume();
    const response = fs.readSync(process.stdin.fd, 1000000000, 0, 'utf-8');
    process.stdin.pause();

    return response[0];
  }
}
