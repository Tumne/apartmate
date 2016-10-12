var _ = require('underscore');
var check = require('validator').check
var RSVP = require('rsvp');
var mongoose = require('mongoose');
var config = require('../../config');
var moment = require('moment');
//var db = mongoose.connect(config.development.dbUrl);

var PeopleImages = new mongoose.Schema({

    id                     : mongoose.Schema.ObjectId 
    , url                           : String
    , thumbUrl                      : String
    , filename						: String
    , propertyId                    : String
    , bytes                    		: String
    , apartmateUserId               : String
    , published				 : Boolean
    , createdAt              : { type: Date, default: Date.now }
    , updatedAt              : { type: Date, default: Date.now }  
});

module.exports = mongoose.model('PeopleImages', PeopleImages);
