const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4'); // Random uuid

/**
 * An object mapping from uuids to an object with the following shape
 * {string} word - The word to be guessed
 * {int} timestamp - A timestamp generated using Date.now(), used to clean up old games
 * {int} incorrectGuesses - The number of incorrect guesses for this game so far
 * {boolean[]} markedLetters - An array of booleans of length equal to word indicating whether or not a letter has been correctly guessed
 *  true if correctly guessed
 *  false if not yet guessed
 */
const games = {};

/**
 * Initialize a new game object with the given uuid
 *
 * @param {string} uuid - A uuid to associate with a given game
 */
const startGame = (uuid) => {
  console.log("Starting game with uuid " + uuid);
  games[uuid] = {
    word: 'word',
    timestamp: Date.now(),
    incorrectGuesses: 0,
    markedLetters: Array('word'.length).fill(false)
  };
};

app.get('/', (req, res) => {
  const uuid = uuidV4();
  startGame(uuid);
  res.redirect('/'+uuid);
});
app.get('/:uuid', (req, res) => res.send(games[req.params.uuid]));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
