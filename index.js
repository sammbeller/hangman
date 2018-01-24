// Imports
const express = require('express');
const uuidV4 = require('uuid/v4'); // Random uuid
const Game = require('./src/Game');
const GameHolder = require('./src/InMemoryGameHolder');
const WordAccessor = require('./src/InMemoryWordAccessor');
// Initialize the app and configuration
const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// Game Variables
// The GameHolder object that will hold all games
const games = new GameHolder();
// The Word Accessor, from which words are retreived
const words = new WordAccessor();
// The maximum number of missed guesses after which the user has lost
const max_missed_guesses = 10;
// The alphabet of acceptable letters
const alphabet = new Set(['A','B','C','D','E','F','G','H',
                          'I','J','K','L','M','N','O','P',
                          'Q','R','S','T','U','V','W','X',
                          'Y','Z']);
// Max lifetime ends up being something like twice this
const game_lifetime = 1000 * 60 * 5;
// Track won and lost games
let games_won = 0;
let games_lost = 0;

// Cleanup games at regular intervals
setInterval(games.cleanup.bind(games), game_lifetime);

/**
 * Generate a new word
 */
const getNewWord = () => {
  return words.getRandomWord();
};

/**
 * Initialize a new game object with the given uuid and word
 *
 * @param {string} uuid - A uuid to associate with a given game
 * @param {string} word - The word to be guessed in this new game
 */
const startGame = (uuid, word) => {
  console.log("Starting game with uuid " + uuid);
  games.add(uuid, new Game(word));
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
 * Blank game route, generate a new game then redirect to that game's page
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

  // If there's no game, redirect to 404
  if (!games.has(req.params.uuid)) {
    res.redirect('/404');
  }

  const game = games.get(req.params.uuid);
  const missedGuesses = game.getMissedGuesses();

  // Get the background image position based on the number of missed guesses
  // Default to 100x100 so nothing is shown
  let backgroundPosition = 'background-position: 100px 100px;';
  switch(missedGuesses) {
    case 1:
      backgroundPosition = 'background-position: -45px -10px;';
      break;
    case 2:
      backgroundPosition = 'background-position: -135px -10px;';
      break;
    case 3:
      backgroundPosition = 'background-position: -220px -10px;';
      break;
    case 4:
      backgroundPosition = 'background-position: -310px -10px;';
      break;
    case 5:
      backgroundPosition = 'background-position: -380px -10px;';
      break;
    case 6:
      backgroundPosition = 'background-position: -10px -95px;';
      break;
    case 7:
      backgroundPosition = 'background-position: -95px -95px;';
      break;
    case 8:
      backgroundPosition = 'background-position: -180px -95px;';
      break;
    case 9:
      backgroundPosition = 'background-position: -265px -95px;';
      break;
    case 10:
      backgroundPosition = 'background-position: -350px -95px;';
      break;
  }

  if (game.isWon()) {
    res.render('win.pug', {
      word: game.word,
      gamesWon: games_won,
      gamesLost: games_lost
    });
  } else if (game.isLost()) {
    res.render('win.pug', {
      word: game.word,
      gamesWon: games_won,
      gamesLost: games_lost
    });  } else {
     res.render('game.pug', {
      displayWord: game.renderDisplayWord(),
      unguessedLetters: [...game.getUnguessedLetters(alphabet)],
      missedGuesses,
      backgroundPosition
     });
  }
});

/**
 * Guess route, make a guess for a game then redirect to that game's page
 */
app.post('/game/:uuid', (req, res) => {

  // If there's no game, redirect to 404
  if (!games.has(req.params.uuid)) {
    res.redirect('/404');
  }

  const game = games.get(req.params.uuid);

  if (game.isWon()) {
    console.log("Received guess for already won game, redirecting");
  } else if (game.isLost()) {
    console.log("Received guess for already lost game, redirecting");
  } else {
    console.log('Received guess for game ' + req.params.uuid + ' and guess ' + req.body.guess);
    try {
      game.guess(req.body.guess, alphabet);
      // Track if the game is now won or lost
      if (game.isWon()) {
        games_won++;
      } else if (game.isLost()) {
        games_lost++;
      }
    } catch (e) { // Received an invalid guess
      res.redirect('/400');
    }
  }
  res.redirect('/game/'+req.params.uuid);
});

/**
 * ERROR PAGES
 */
app.get('/400', (req, res) => {
  res.status(400);
  res.send('You tried to make an illegal guess!');
});

app.get('/404', (req, res) => {
  res.status(404);
  res.send('Sorry, the requested game does not exist. It may have been cleaned up.');
});

app.listen(3000, () => console.log('Let\'s Play Hangman!!'));
