# INSTALLATION
This app uses npm version 5.6.0 and node version 8.9.0
You may install these however you wish. It is reccomended to use nvm, however you can also go to nodejs.org and download the LTS distribution

Next clone or download this repository to a suitable location
e.g. `git clone https://github.com/sammbeller/hangman.git`

Finally, navigate into the directory and run `npm install`

# TO RUN
simply call `node index.js`

 
# TODO
* [X] Choose view layer
* [X] Failure route when uuid isn't in games
  * [X] view
  * [X] Route
* [X] Cleanup games periodically
* [X] Do I need to do anything if someone guesses more than one letter?
* [X] Add isWon method
* [X] Add isLost method
* [X] Track wins
* [X] Track losses
* [X] Get real words
* [ ] Should I update timestamp on activity?
* [X] convert games to Map
* [X] Add guessedLetters Set
* [X] Add methods determining correctly/incorrectly guessed letters
* [X] convert isWon and isLost to use guessedLetters
* [ ] Installation script
