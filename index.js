// Imports
const express = require('express');
const uuidV4 = require('uuid/v4'); // Random uuid
const Game = require('./Game');
// Initialize the app and configuration
const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// Game Variables
// A Map from uuids to Games
const games = new Map([]);
// The maximum number of missed guesses after which the user has lost
const max_missed_guesses = 10;
// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);
const game_lifetime = 1000 * 60 * 5;
/**
 * A method to cleanup games, filters on the amount of time passed between a game's timestamp and now
 */
const cleanupGames = (lifetime) => {
  // Use the same time for all comparisons
  const now = Date.now();
  Object.entries(games).filter(([uuid, game]) => {
    if (game.timestamp > now) {
      console.log("game with uuid " + uuid + " has timestamp greater than now. Removing");
      return false;
    } else { 
      return now - game.timestamp <= lifetime;
    }
  })
};

/**
 * Generate a new word
 */
const getNewWord = () => {
  return 'WORD';
};

/**
 * Initialize a new game object with the given uuid and word
 *
 * @param {string} uuid - A uuid to associate with a given game
 * @param {string} word - The word to be guessed in this new game
 */
const startGame = (uuid, word) => {
  console.log("Starting game with uuid " + uuid);
  games.set(uuid, new Game(word));
};

/**
 * Request for favicon, respond with nothing
 */
app.get('/favicon.ico', (req, res) => {
  res.status(200);
});

/**
 * Root path, just redirects to /game
 */
app.get('/', (req,res) => {
  res.redirect('/game');
});

/**
 * Blank game route, generate a new game then redirect to that games page
 */
app.get('/game', (req, res) => {
  console.log('Received request for ' + req.url);
  const uuid = uuidV4();
  const word = getNewWord();
  startGame(uuid, word);
  res.redirect('/game/'+uuid);
});

/**
 * Page for a game
 */
app.get('/game/:uuid', (req, res) => {
  console.log('Received request for ' + req.url);

  const game = games.get(req.params.uuid);

  if (game.isWon()) {
    res.send('You won! The word was ' + game.word);
  } else if (game.isLost()) {
    res.send('You lost! The word was ' + game.word);
  } else {
     res.render('game.pug', {
      displayWord: game.renderDisplayWord(),
      unguessedLetters: [...game.getUnguessedLetters(alphabet)],
      missedGuesses: game.getMissedGuesses()
     });
  }
});

/**
 * Guess route, make a guess for a game then redirect to that game's page
 */
app.post('/game/:uuid', (req, res) => {

  const game = games.get(req.params.uuid);

  if (game.isWon()) {
    console.log("Received guess for already won game, redirecting");
  } else if (game.isLost()) {
    console.log("Received guess for already lost game, redirecting");
  } else {
    console.log('Received guess for game ' + req.params.uuid + ' and guess ' + req.body.guess);
    try {
      game.guess(req.body.guess, alphabet);
    } catch (e) { // Received an invalid guess
      // TODO: redirect to error page here
      res.status(400);
      res.send(e);
    }
  }
  res.redirect('/game/'+req.params.uuid);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
