module.exports = class Game {
  /**
   * Sole constructor for the game class
   *
   * @param {string} word - The word to be guessed during this game
   */
  constructor(word) {
    // The word to be guessed during this game
    this.word = word;
    // A timestamp used to clean up old games
    this.timestamp = Date.now();
    // A set of letters already guessed
    this.guessedLetters = new Set([]);
  }

  /**
   * Get a set of letters that have not yet been guessed
   *
   * @param {Set} alphabet - An alphabet of letters. guessedLetters is a proper subset of this set
   * @returns {Set} - The set unguessedLetters such that unguessedLetters union guessedLetters = alphabet
   */
  getUnguessedLetters(alphabet) {
    return new Set([...alphabet].filter(letter => !this.guessedLetters.has(letter)));
  }

  /**
   * Gets the number of missed guesses in this game so far
   *
   * @returns {int} - The number of entries in this.guessedLetters not in this.word
   */
  getMissedGuesses() {
    let missedGuesses = 0;

    this.guessedLetters.forEach((letter) => {
      if (!this.word.includes(letter)) {
        missedGuesses++;
      }
    });
    return missedGuesses;
  }

/**
 * Render the word for display using underscores for letters that have not yet been guessed
 *
 * @returns {string} - A string representing the word with unguessed letters replaced by underscores
 *    characters are separated by spaces
 */
  renderDisplayWord() {
    return this.word.split('').map((character) => {
      if (this.guessedLetters.has(character)) {
        return character;
      } else {
        return '_';
      }
    }).join(' ');
  }

  /**
   * Guess a letter for this game
   *
   * @param {string} guess - The guess
   * @param {Set} alphabet - A set containing the range of valid guesses in upper case
   */
  guess(guess, alphabet) {
    if (alphabet.has(guess.toUpperCase())) {
      this.guessedLetters.add(guess.toUpperCase());
    } else {
      console.log('Received illegal guess ' + guess);
      throw new Error('Illegal Guess'); 
    }
  }

  /**
   * Test if a game is won. Does not update the game
   *
   * @returns {boolean} - False if the this.isLost(), 
   *  true if all characters in this.word are contained in this.guessedLetters, else false
   */
  isWon() {
    if (this.isLost()) {
      return false;
    }
    return this.word.split('')
      .reduce((accumulator, currentValue) => { 
        return accumulator && this.guessedLetters.has(currentValue);
      }, true);
  }
  

  /**
   * Test if a game is lost. Does not update the game
   *
   * @returns {boolean} - True if there are 10 or more missedGuesses, else false
   */
  isLost() {
    return this.getMissedGuesses() >= 10;
  }
}
