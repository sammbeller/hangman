module.exports = class InMemoryGameHolder {

  /**
   * Simple constructor that initializes an empty set
   *
   * @param {object} config - A configuration object with the following shape
   * @param {int} config.lifespan - The maximum lifespan of a game
   */
  constructor({lifespan}={lifespan: 1000*60*5}) {
    this.games = new Map([]);
    this.lifespan = lifespan;
  }

  /**
   * Adds a game to the set of active games
   *
   * @param {string} uuid - A uuid to associate with a given game
   * @param {Game} game - The game to be added
   */
  add(uuid, game) {
    this.games.set(uuid, game);
  }

  /**
   * Gets the game associated with the given uuid
   *
   * @param {string} uuid - The uuid of the game to fetch
   * @returns {Game} - The game associated with the uuid
   */
  get(uuid) {
    return this.games.get(uuid);
  }

  /**
   * Checks if this holder contains a game associated with the given uuid
   *
   * @param {string} uuid - The uuid to check
   * @returns {boolean} - True if there is such a game, else false
   */
  has(uuid) {
    return this.games.has(uuid);
  }

  /**
   * Remove all games older than this.lifespan
   *
   */
  cleanup() {
    console.log('Cleaning up games');
    const now = Date.now();
    this.games = new Map([...this.games].filter(([uuid, game]) => {
      return now - game.timestamp <= this.lifespan;
    }));
  }
}
