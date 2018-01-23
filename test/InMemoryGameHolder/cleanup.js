const assert = require('assert');
const Game = require('../../src/Game');
const InMemoryGameHolder = require('../../src/InMemoryGameHolder');

module.exports = () => {
  describe('cleanup()', () => {
    it('Deletes games older than the lifespan with which it\'s set', () => {
      const game = new Game('WORD');
      game.timestamp -= 1000;
      const games = new InMemoryGameHolder({lifespan: 0});
      games.add('a', game);
      games.cleanup();
      assert(!games.has('a'));
    });
    it('Doesn\'t delete games that are less old than the lifespan with which it\'s set', () => {
      const game = new Game('WORD');
      const games = new InMemoryGameHolder();
      games.add('a', game);
      games.cleanup();
      assert(games.has('a'));
    });
  });
}
