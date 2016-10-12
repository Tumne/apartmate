var _ = require('underscore');
var check = require('validator').check
var RSVP = require('rsvp');
var mongoose = require('mongoose');
var config = require('../../config');
var moment = require('moment');
//var db = mongoose.connect(config.development.dbUrl);

var SharedProperty = new mongoose.Schema({

    propertyId                      : mongoose.Schema.ObjectId 
    , propertyFriendlyId            : { type: String, uppercase: true}
    , createdById                   : { type: String }
    , propertyType                  : { type: String }
    , basementApartment             : { type: String }
    , availBedrooms                 : { type: String }
    , availBathrooms                : { type: String }
    , bedrooms                      : { type: String }
    , bathrooms                     : { type: String }
    , streetAddress                 : { type: String }
    , postalCode                    : { type: String }
    , availabilityDate              : { type: Date, default: Date.now }
    , leaseTermsAvailable           : [{
        name: String
        , id: String
    }]
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
    , featuresIncluded              : [{
        name: String
        , id: String
    }]
    , description                   : { type: String }
    , name                          : { type: String }
    , landlordType                  : { type: String }
    , gender                        : [{
        name: String
        , id: String
    }]
    , contactPreferences            : [{
        name: String
        , id: String
    }]
    , ageGroup                      : { type: String }
    , lifestyle                     : { type: String }
    , personalDescription           : { type: String }
    , createdAt              : { type: Date, default: Date.now }
    , updatedAt              : { type: Date, default: Date.now }  
});


module.exports = mongoose.model('SharedProperty', SharedProperty);
