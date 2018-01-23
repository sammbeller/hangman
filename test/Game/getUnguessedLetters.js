const assert = require('assert');
const Game = require('../../src/Game');

// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);

module.exports = () => {
  describe('getUnguessedLetters()', () => {
    // getUnusedLetters should only return values not in game.guessedLetters
    it('Returns letters not already guessed', () => {
      const game = new Game('WORD');
      // Get 10 random letters to guess
      const guesses = new Set([]);
      for (let i = 1; i <= 10; i++) {
        guesses.add([...alphabet][Math.floor(Math.random() * [...alphabet].length)]);
      }

      guesses.forEach((guess) => game.guessedLetters.add(guess));

      assert([...game.getUnguessedLetters(alphabet)].reduce((accumulator, letter) => {
        return accumulator && !game.guessedLetters.has(letter);
      }, true), 'None of the returned letters should be in game.guessedLetters');
    });

    // Everything in getUnusedLetters should be in the alphabet passed in
    it('Returns letters in the alphabet', () => {
      const game = new Game('WORD');

      assert([...game.getUnguessedLetters(alphabet)].reduce((accumulator, letter) => {
        return accumulator && alphabet.has(letter);
      }, true), 'All letters returned by getUnguessedLetters should be in the alphabet');
    });

    it('The union of getUnguessedLetters and guessedLetters should equal the alphabet', () => {
      const game = new Game('WORD');
      game.guessedLetters.add('A').add('B').add('C').add('D');

      assert.deepEqual(alphabet, new Set([...game.guessedLetters, ...game.getUnguessedLetters(alphabet)]),
        'The union of game.guessedLetters and game.getUnguessedLetters() should be the alphabet');
    });
  });
}
