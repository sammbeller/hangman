const assert = require('assert');
const Game = require('../../src/Game');

// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);


describe('Game', () => {
  describe('guess()', () => {
    // Test some random input
    it('Correctly registers guesses in the guessedLetters set', () => {
      const game = new Game('word');
      // Get 10 random letters to guess
      const guesses = new Set([]);
      for (let i = 1; i <= 10; i++) {
        guesses.add([...alphabet][Math.floor(Math.random() * [...alphabet].length)]);
      }

      guesses.forEach((guess) => game.guess(guess, alphabet));

      assert.deepEqual(guesses, game.guessedLetters, 'The guesses should be the same as game.guessedLetters');
    });

    // Test lower case input
    it('Accepts the lower case versions of letters in the alphabet', () => {
      const game = new Game('word');
      // Get 10 random letters to guess
      const guesses = new Set([]);
      for (let i = 1; i <= 10; i++) {
        guesses.add([...alphabet][Math.floor(Math.random() * [...alphabet].length)]);
      }

      guesses.forEach((guess) => game.guess(guess.toLowerCase(), alphabet));

      assert.deepEqual(guesses, game.guessedLetters, 'The guesses should be the same as game.guessedLetters');
    });

    // Test bad input
    it('Throws an error when receiving input not in the alphabet', () => {
      const game = new Game('word');
      assert.throws(() => game.guess('a', new Set([])), null, 'An error should be thrown when receiving a guess not in the alphabet');
    });
  });
});
