const FileSystem = require('fs');

module.exports = class OnDiskMemoryAccessor {

  /**
   * Invariants: newline sepearated, utf8
   */
  constructor({filePath}={filePath: 'data/words.txt'}) {
    this.words = FileSystem.readFileSync('data/words.txt', 'utf8').split('\n');
  }

  getRandomWord() {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

}
