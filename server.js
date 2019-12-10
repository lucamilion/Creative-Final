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

// Setup schema
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
});

const gameSchema = new mongoose.Schema({
  title: String,
  imgPath: String,
  minPlayers: Number,
  maxPlayers: Number,
  time: Number,
  recommendingUser: String
})

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

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

//post route for adding stuff
app.post('/api/items', async(req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

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

// Get a list of all of the items in the museum.
app.get('/api/items', async(req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
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
app.post('/api/rate', async(req, res) => {

  var query = { "title": req.tile }
  try {
    Game.findOneAndUpdate(query, req.newData, { upsert: false }, function(err, doc) {
      if (err) return res.send(500, { error: err })
      return res.send("sunshine and rainbows")
    })
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
