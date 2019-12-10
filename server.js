const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/games', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer');
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});


const gameSchema = new mongoose.Schema({
  title: String,
  imgPath: String,
  minPlayers: Number,
  maxPlayers: Number,
  time: Number,
  recommendingUser: String
})

const Game = mongoose.model('Game', gameSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async(req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.listen(3001, () => console.log('Server listening on port 3001!'));

app.post('/api/games', async(req, res) => {
  const game = new Game({
    title: req.body.title,
    imgPath: req.body.imgPath,
    minPlayers: req.body.minPlayers,
    maxPlayers: req.body.maxPlayers,
    time: req.body.time,
    recommendingUser: req.body.recommendingUser,
  });
  try {
    await game.save();
    res.send(game);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/games', async(req, res) => {
  try {
    let games = await Game.find();
    res.send(games);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
