/**
 * Test aggregator for the Game class
 * Use this test to determine the order in which tests are run
 */
describe('Game', () => {
  require('./guess')();
  require('./getUnguessedLetters')();
  require('./getMissedGuesses')();
  require('./isWon')();
  require('./isLost')();
});
