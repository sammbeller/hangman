module.exports = class InMemoryGameHolder {

  /**
   * Simple constructor that initializes an empty set
   */
  constructor() {
    this.games = new Map([]);
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
}
