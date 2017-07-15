// const validate = require('../models/validate.js');
const express = require('express');
const router = express.Router();
const app = require('../app.js');
var numTrysLeft = 10;

const fs = require('fs');
//Variable for our random words.
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//Variable selection the random word.
var differentWords = words [Math.floor(Math.random() * words.length)];
//Variable spliting the random word.
var newWord = differentWords.toUpperCase().split('');

router.get('/', function(req, res){
  res.redirect('/Guess-It');
});

router.get('/Guess-It', function(req, res){
  // console.log(req.session);
  // console.log(req.session.guess);
  res.render('main', {mainError: req.session.messages,
                      randomWords: newWord,
                      userGuesses: req.session.allGuesses,
                      try: numTrysLeft
                      });
});


router.post('/Guess-It', function(req, res){
  // Variable Containing error messages. Its placed here to clear it each time an error is found..
  // ... so they don't stack on top of each other.
  var messages = [];
  var guessed = false;
  req.checkBody('inputField', 'Please enter a letter to guess ....').isAlpha();
  req.checkBody('inputField', 'Please enter at the most 1 letter before hitting the "GUESS" button. ').notEmpty();
  req.checkBody('inputField', 'Please enter only one letter before hitting the "GUESS" button. ').isLength({max: 1});

  let errors = req.validationErrors();

  //Loggs Errors and Displays them
  if (errors){
    errors.forEach(function(error) {
      messages = [];
      messages.push(error.msg);
      console.log(messages);
      // validate.valid(req, res);
      req.session.messages = messages;
    });

    return res.redirect('/Guess-It');
  }

    //Variable for what is typed in by the user.
  let newVar = req.body.inputField.toUpperCase();
  req.session.guess = newVar;


     if(!req.session.allGuesses) {
      req.session.allGuesses = [];
      req.session.messages = [];
    }
    req.session.allGuesses.push(newVar);

    res.redirect('/Guess-It');


  });






module.exports = router;
