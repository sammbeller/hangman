const assert = require('assert');
const Game = require('../../src/Game');

// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);

module.exports = () => {
  describe('getMissedGuesses()', () => {
    it('Returns 0 when no guesses have been made', () => {
      const game = new Game('WORD');
      assert.equal(0, game.getMissedGuesses());
    });

    it('Returns the number of guesses in game.guessedLetters not in the word', () => {
      const game = new Game('WORD');

      game.guessedLetters.add('A').add('B').add('C')
                          .add('W').add('O');

      assert.equal(3, game.getMissedGuesses());
    });
  });

}
