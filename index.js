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

app.get('/', (req, res) => {
  const uuid = uuidV4();
  const word = getNewWord();
  startGame(uuid, word);
  res.redirect('/'+uuid);
});

app.get('/:uuid', (req, res) => res.send(games[req.params.uuid]));

app.get('/:uuid/:guess', (req, res) => {
  guess(games[req.params.uuid], req.params.guess);
  res.redirect('/'+req.params.uuid);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
