// Imports
const express = require('express');
const uuidV4 = require('uuid/v4'); // Random uuid
const CookieParser = require('cookie-parser');
const Game = require('./src/Game');
const GameHolder = require('./src/InMemoryGameHolder');
const WordAccessor = require('./src/InMemoryWordAccessor');
// Initialize the app and configuration
const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use(CookieParser());

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
  // Check if there's a game in the cookie and redirect if there is
  if (req.cookies.game) {
    res.redirect('/game/'+req.cookies.game);
    return;
  }

  const uuid = uuidV4();
  const word = words.getRandomWord();
  // Start a new game
  console.log("Starting game with uuid " + uuid);
  games.add(uuid, new Game(word));
  res.cookie('game', uuid);
  res.redirect('/game/'+uuid);
});

/**
 * Page for a game
 */
app.get('/game/:uuid', (req, res) => {
  console.log('Received request for ' + req.url);

  // Check if there's a game in the cookie and redirect if there is
  if (req.cookies.game && req.cookies.game !== req.params.uuid) {
    res.redirect('/game/'+req.cookies.game);
    return;
  }

  if (!games.has(req.params.uuid)) {
    if (req.cookies.game === req.params.uuid) {
      res.clearCookie('game');
    }
    res.status(404);
    res.send('Sorry, the requested game does not exist. It may have been cleaned up.');
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
    if (req.cookies.game === req.params.uuid) {
      res.clearCookie('game');
    }
    res.render('win.pug', {
      word: game.word,
      gamesWon: games_won,
      gamesLost: games_lost
    });
  } else if (game.isLost()) {
    if (req.cookies.game === req.params.uuid) {
      res.clearCookie('game');
    }
    res.render('lost.pug', {
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

  if (!games.has(req.params.uuid)) {
    if (req.cookies.game === req.params.uuid) {
      res.clearCookie('game');
    }
    res.status(404);
    res.send('Sorry, the requested game does not exist. It may have been cleaned up.');
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
      res.status(400);
      res.send('You tried to make an illegal guess!');
      return;
    }
  }
  res.redirect('/game/'+req.params.uuid);
});

app.listen(3000, () => console.log('Let\'s Play Hangman!!'));
