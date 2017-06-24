const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const validator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
var differentWords = words [Math.floor(Math.random() * words.length)];
var newWord = differentWords.split('');

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

app.get('/Guess-It', function(req, res){
  console.log(req.session);
  console.log(req.session.guess);
  res.render('main', {mainError: req.session.messages,
                      randomWords: newWord,
                      userGuesses: req.session.allGuesses
                      });
});

app.post('/Guess-It', function(req, res){
  var messages = [];
  req.checkBody('inputField', 'Please enter a letter to guess ....').isAlpha();
  req.checkBody('inputField', 'Please enter at the most 1 letter before hitting the "GUESS" button. ').notEmpty();
  req.checkBody('inputField', 'Please enter only one letter before hitting the "GUESS" button. ').isLength({max: 1});

  let errors = req.validationErrors();

  if (errors){
    errors.forEach(function(error) {
      messages = [];
      messages.push(error.msg);
      console.log(messages);

      // res.render('main', {randomWords:newWord, mainError: messages});
    });
  }

  let newVar = req.body.inputField;
  req.session.guess = newVar;
  req.session.messages = messages;

    if (!req.session.allGuesses) {
      req.session.allGuesses = [];
    }
    req.session.allGuesses.push(newVar);

  res.redirect('/Guess-It');
});







app.listen(3000, function(req, res){
  console.log('Party Time !');
});
