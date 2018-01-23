/**
 * Test aggregator for the Game class
 * Use this test to determine the order in which tests are run
 */
describe('Game', () => {
  require('./guess')();
  require('./isWon')();
});
