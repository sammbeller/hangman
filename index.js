const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4'); // Random uuid

const games = {};

const startGame = (uuid) => {
  console.log("Starting game with uuid " + uuid);
  games[uuid] = {
    word: 'word'
  };
};


app.get('/', (req, res) => {
  const uuid = uuidV4();
  startGame(uuid);
  res.redirect('/'+uuid);
});
app.get('/:uuid', (req, res) => res.send(games[req.params.uuid]));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
