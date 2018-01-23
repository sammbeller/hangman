const assert = require('assert');
const Game = require('../../src/Game');

module.exports = () => {
  describe('isLost()', () => {
    // Make sure the game is lost when 10 wrong guesses have been made
    it('Is lost when 10 wrong guesses are made');

    // Make sure the game is lost when more than 10 wrong guesses have been made
    it('Is lost when more than 10 wrong guesses are made');

    // The game should not be lost if onle 9 wrong guesses are made
    it('Is not lost when only 9 wrong guesses are made');

  });
}
