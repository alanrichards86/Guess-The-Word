// const validate = require('../models/validate.js');
const express = require('express');
const router = express.Router();
const app = require('../app.js');
var numTrysLeft = 8;
var wrongLetterGuessed = [];
var rightLetters = [];
var letterHolder = [];
var underscore = [];
var messages = [];
var sameLetterGuessed = [];

const fs = require('fs');
//Variable for our random words.
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//Variable selection the random word.
var differentWords = words [Math.floor(Math.random() * words.length)];
//Variable spliting the random word.
var newWord = differentWords.toUpperCase().split('');
console.log(newWord);

newWord.forEach(function(letterUnderscore){
  underscore.push('_');
});

router.get('/', function(req, res){
  res.redirect('/Guess-It');
});

router.get('/You-Win', function(req, res){
  res.render('gameWon', {randomWords: newWord});
});

router.post('/', function(req, res){
  underscore = [];
  numTrysLeft = 8;
  wrongLetterGuessed = [];
  differentWords = words [Math.floor(Math.random() * words.length)];
  newWord = differentWords.toUpperCase().split('');
  newWord.forEach(function(letterUnderscore){
    underscore.push('_');
  });
  console.log(newWord);
  res.redirect('Guess-It');
  });

router.get('/Guess-It', function(req, res){

  res.render('main', {mainError: req.session.messages,
                      randomWords: newWord,
                      userGuesses: wrongLetterGuessed,
                      try: numTrysLeft,
                      letterUnderscore: underscore,
                      sameGuess: sameLetterGuessed
                      });
});

router.get('/End-Game', function(req, res){
  res.render('end-game', {randomWords: newWord})
});


router.post('/Guess-It', function(req, res){
  let newVar = req.body.inputField.toUpperCase();

  // Variable Containing error messages. Its placed here to clear it each time an error is found..
  // ... so they don't stack on top of each other.
  messages = [];

  var guessed = false;
  req.checkBody('inputField', 'Please enter a letter and not a number ....').isAlpha();
  req.checkBody('inputField', 'Please enter at the most 1 letter before hitting the "GUESS" button. ').notEmpty();
  req.checkBody('inputField', 'Please enter only one letter before hitting the "GUESS" button. ').isLength({max: 1});

  let errors = req.validationErrors();

  //Loggs Errors and Displays them
  if (errors){
    errors.forEach(function(error) {
      messages = [];
      messages.push(error.msg);
      console.log(messages);
      req.session.messages = messages;
    });
    return res.redirect('/Guess-It');


  }
  //Iterating over the random word...
  //then taking that word and assigning it to a variable...
  for (var i = 0; i < newWord.length; i++) {
      var wordParts = newWord[i]
      //Checking to see if random word is = to the inputField newVar
      //if it is then pushing the letter its = to to a correct letters Variable
      if (wordParts === newVar) {
        guessed = true;
        rightLetters.push(wordParts);
        underscore[i] = newWord[i];
      }
    }

    if (guessed === false && newVar != wrongLetterGuessed && errors != true){
        wrongLetterGuessed.push(newVar);
        numTrysLeft -= 1;
    }
  
    if (numTrysLeft == 0){
      return res.redirect('/End-Game')
      }

      if (underscore.indexOf('_') < 0) {
      return res.redirect('/You-Win');
      }

    res.redirect('/Guess-It');


});

module.exports = router;
