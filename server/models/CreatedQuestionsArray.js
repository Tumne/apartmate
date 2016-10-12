
var mongoose = require('mongoose');
var config = require('../../config');

var CreatedQuestionsArray = new mongoose.Schema({
      userId                : mongoose.Schema.ObjectId
    , email                 : String
    , question              : String
    , option                : [{
          _id   : Number
        , order : Number
        , name  : String
    }]
},

{ collection : 'createdquestions' });

module.exports = mongoose.model('CreatedQuestionsArray', CreatedQuestionsArray);
