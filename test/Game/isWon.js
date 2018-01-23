const assert = require('assert');
const Game = require('../../src/Game');

// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);

module.exports = () => {
  describe('isWon()', () => {
    // Make sure the game is won when all letters in the word are guessed
    it('Is won when all letters in the word are guessed', () => {
      const game = new Game('WORD');
      game.guessedLetters.add('W').add('O').add('R').add('D');
      assert(game.isWon(), 'Game should be won');
    });

    // Make sure the game is not won when most of the letters in the word are guessed
    it('Is not won when only some of the letters in the word are guessed', () => {
      const game = new Game('WORD');
      game.guessedLetters.add('W').add('O').add('R');
      assert(!game.isWon(), 'Game should not be won');
    });

    // Make sure the game is not won when none of the letters in the word are guessed
    it('Is not won when no letters in the word are guessed', () => {
      const game = new Game('WORD');
      game.guessedLetters.add('A').add('B').add('C');
      assert(!game.isWon(), 'Game should not be won');
    });
  });
}
