const assert = require('assert');
const Game = require('../../src/Game');

module.exports = () => {
  describe('isLost()', () => {
    // Make sure the game is lost when 10 wrong guesses have been made
    it('Is lost when 10 wrong guesses are made', () => {
      const game = new Game('WORD'); 

      game.guessedLetters.add('A').add('B').add('C')
                          .add('E').add('F').add('G')
                          .add('H').add('I').add('J')
                          .add('K');
      assert(game.isLost());
    });

    // Make sure the game is lost when more than 10 wrong guesses have been made
    it('Is lost when more than 10 wrong guesses are made', () => {
      const game = new Game('WORD'); 

      game.guessedLetters.add('A').add('B').add('C')
                          .add('E').add('F').add('G')
                          .add('H').add('I').add('J')
                          .add('K').add('L').add('M');
      assert(game.isLost());    
    });

    // The game should not be lost if onle 9 wrong guesses are made
    it('Is not lost when only 9 wrong guesses are made', () => {
      const game = new Game('WORD'); 

      game.guessedLetters.add('A').add('B').add('C')
                          .add('E').add('F').add('G')
                          .add('H').add('I').add('J');
      assert(!game.isLost());    
    });

  });
}
