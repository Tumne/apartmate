
var mongoose = require('mongoose');
var config = require('../../config');

var QuestionsArray = new mongoose.Schema({
      qid                   : Number
    , question              : String
    , option                : [{
          _id   : Number
        , order : Number
        , name  : String
    }]
},

{ collection : 'questionsquery' });

module.exports = mongoose.model('QuestionsArray', QuestionsArray);
