const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4'); // Random uuid

/**
 * An object mapping from uuids to an object with the following shape
 * {string} word - The word to be guessed
 * {int} timestamp - A timestamp generated using Date.now(), used to clean up old games
 * {int} incorrectGuesses - The number of incorrect guesses for this game so far
 * {boolean[]} markedLetters - An array of booleans of length equal to word indicating whether or not a letter has been correctly guessed
 *   true if correctly guessed
 *   false if not yet guessed
 */
const games = {};

/**
 * Render the word for display using underscores for letters that have not yet been guessed
 */
const renderDisplayWord = (game) => {
  return Array.prototype.map.call(game.word, (character, index) => {
    if (game.markedLetters[index]) {
      return character;
    } else {
      return '_';
    }
  }).join(' ');
};

/**
 * Generate a new word
 */
const getNewWord = () => {
  return 'word';
};

/**
 * Initialize a new game object with the given uuid and word
 *
 * @param {string} uuid - A uuid to associate with a given game
 * @param {string} word - The word to be guessed in this new game
 */
const startGame = (uuid, word) => {
  console.log("Starting game with uuid " + uuid);
  games[uuid] = {
    word: word,
    timestamp: Date.now(),
    incorrectGuesses: 0,
    markedLetters: Array(word.length).fill(false)
  };
};

/**
 * Guess a letter
 * This method iterates through game.word, comparing elements to guess
 * If none match game.incorrectGuesses is incremented
 * Else the corresponding index in game.markedLetters is set to true
 */
const guess = (game, guess) => {
  let correctGuess = false;
  for (let i = 0; i < game.word.length; i++) {
    if (game.word[i] === guess) {
      game.markedLetters[i] = true;
      correctGuess = true;
    }
  }

  if (!correctGuess) {
    game.incorrectGuesses++;
  }
};

/**
 * Test if a game is won. Does not update the game
 * @returns {boolean} - True if all elements of game.markedLetters are true, else false
 */
const isWon = (game) => {
  return game.markedLetters.reduce((accumulator, currentValue) => accumulator && currentValue, true);
};

/**
 * Test if a game is lost. Does not update the game
 * @returns {boolean} - True if game.incorrectGuesses == 10, else false
 */
const isLost = (game) => {
  return game.incorrectGuesses == 10;
};

/**
 * Request for favicon, respond with nothing
 */
app.get('/favicon.ico', (req, res) => {
  res.status(200);
});

/**
 * Index route, generate a new game then redirect to that games page
 */
app.get('/', (req, res) => {
  console.log('Received request for ' + req.url);
  const uuid = uuidV4();
  const word = getNewWord();
  startGame(uuid, word);
  res.redirect('/'+uuid);
});

/**
 * Page for a game
 */
app.get('/:uuid', (req, res) => {
  console.log('Received request for ' + req.url);

  const game = games[req.params.uuid];

  if (isWon(game)) {
    res.send('You won! The word was ' + game.word);
  } else if (isLost(game)) {
    res.send('You lost! The word was ' + game.word);
  } else {
    res.send({
      game: games[req.params.uuid], 
      displayWord: renderDisplayWord(games[req.params.uuid]),
      won: isWon(games[req.params.uuid]),
      lost: isLost(games[req.params.uuid])
    })
  }
});

/**
 * Guess route, make a guess for a game then redirect to that game's page
 */
app.get('/:uuid/:guess', (req, res) => {

  const game = games[req.params.uuid];

  if (isWon(game)) {
    console.log("Received guess for already won game, redirecting");
  } else if (isLost(game)) {
    console.log("Received guess for already lost game, redirecting");
  } else {
    console.log('Received guess for game ' + req.params.uuid + ' and guess ' + req.params.guess);
    guess(game, req.params.guess);
  }
  res.redirect('/'+req.params.uuid);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
