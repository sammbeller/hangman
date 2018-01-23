const assert = require('assert');
const Game = require('../../src/Game');

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

    // The game should not be won if it's lost
    it('Is not won if the game is already lost', () => {
      const game = new Game('WORD');
      game.guessedLetters.add('A').add('B').add('C')
                          .add('E').add('F').add('G')
                          .add('H').add('I').add('J')
                          .add('K').add('W').add('O')
                          .add('R').add('D');
    assert(!game.isWon(), 'Game should not be won');
    });
  });
}
