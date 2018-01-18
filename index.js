const express = require('express');
const app = express();
const uuid = require('uuid/v4'); // Random uuid


app.get('/', (req, res) => res.send(uuid()));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
