const express = require('express');
const validator = require('express-validator');
function validateIt(req, res) {
  console.log(req);
//Variable Containing error messages. Its placed here to clear it each time an error is found..
// ... so they don't stack on top of each other.
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

  });
}
}

module.exports = {
  valid: validateIt
}
