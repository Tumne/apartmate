var _ = require('underscore');
var check = require('validator').check
var RSVP = require('rsvp');
var mongoose = require('mongoose');
var config = require('../../config');
var moment = require('moment');
//var db = mongoose.connect(config.development.dbUrl);


 var GatheredListings = new mongoose.Schema({

    propertyId                      : mongoose.Schema.ObjectId 
    , propertyFriendlyId            : { type: String, uppercase: true}
    , createdById                   : { type: String }
    , postDate: []
    , postId: String
    , locationUrl: String
    , tags: String
    , title: String
    , contactLink: String
    , decriptionLink: String
    , questionsResults       : [{
         qid         : Number
       , answer      : Number
       , acceptable  : [{
            id: Number
       }]
       , importance  : Number
    }]
    , fbBoosted                     : { type: Boolean, default: false }
    , fbBoostedExpired              : { type: Date }
    , published                     : {type: Boolean, default: false}
    , publishedAt                   : { type: Date }
    , propertyType                  : { type: String }
    , buildingType                  : { type: String }
    , basementApartment             : { type: String }
    , bedrooms                      : { type: String }
    , bathrooms                     : { type: String }
    , phone                         : { type: String }
    , email                         : { type: String }
    , streetAddress                 : { type: String }
    , unitNumber                    : { type: String }
    , postalCode                    : { type: String }
    , availabilityDate              : { type: Date, default: Date.now }
    , leaseTermsAvailable           : [{
        name: String
        , id: String
    }]
    , location: {
        lon     : {type: Number, default: 0}
      , lat     : {type: Number, default: 0}
    }  
    , rentAmount                    : { type: Number }
    , utlitiesIncluded              : [{
        name: String
        , id: String
    }]
    , couplesWelcome                   : [{
        name: String
        , id: String
    }]
    , petsWelcome                   : [{
        name: String
        , id: String
    }]
    , LGBTWelcome                   : [{
        name: String
        , id: String
    }]
    , featuresIncluded              : [{
        name: String
        , id: String
    }]
    , apartmateUserId               : { type: String }
    , ageGroup                      : { type: String }
    , lifestyle                     : { type: String }
    , description                   : { type: String }
    , personalDescription           : { type: String }
    , name                          : { type: String }
    , landlordType                  : { type: String }
    , personalGender                : { type: String }
    , gender                        : [{
        name: String
        , id: String
    }]
    , contactPreferences            : [{
        name: String
        , id: String
    }]
    , addedImages            : [{
        url: String
        , thumbUrl : String
        , bytes: String
        , id: mongoose.Schema.ObjectId 
    }]
    , addedProfileImages            : [{
        url: String
        , thumbUrl : String
        , id: mongoose.Schema.ObjectId 
    }]
    , createdAt              : { type: Date, default: Date.now }
    , updatedAt              : { type: Date, default: Date.now }  
});


module.exports = mongoose.model('GatheredListings', GatheredListings);
