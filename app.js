const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/router.js')
const validator = require('express-validator');

// const fs = require('fs');
// //Variable for our random words.
// const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
// //Variable selection the random word.
// var differentWords = words [Math.floor(Math.random() * words.length)];
// //Variable spliting the random word.
// var newWord = differentWords.toUpperCase().split('');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret: 'I Love Pie',
  resave: false,
  saveUninitialized: false
}));

app.use('/', router);

module.exports = app;


app.listen(3000, function(req, res){
  console.log('Party Time !');
});
