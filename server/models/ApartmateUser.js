var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");

//var passportLocalMongoose = require('passport-local-mongoose');
var config = require('../../config');
var moment = require('moment');
//var db = mongoose.connect(config.development.dbUrl);

var ApartmateUser = new mongoose.Schema({

    userId                   : mongoose.Schema.ObjectId 
    , username               : { type: String }
    , emailAddress           : { type: String, lowercase: true}
    , phoneNumber            : { type: String, default: '' }
    , password               : String
    , salt                   : { type: String }
    , hash                   : { type: String }
    , firstName              : String
    , lastName               : String
    , displayName            : String
    , selectedGender         : String
    , emailRecieve           : {type: Boolean, default: false}
    , verifiedUser           : {type: Boolean, default: false}
    , verifiedToken          : String
    , activeProfile          : {type: Boolean, default: false}
    , profileCreated         : {type: Boolean, default: false}
    , questionsAnswered      : {type: Boolean, default: false}
    , availabilityDate       : { type: Date }
    , questionsResults       : [{
         qid         : Number
       , answer      : Number
       , acceptable  : [{
            id: Number
       }]
       , importance  : Number
    }]
    , fbModalInit                           : { type: Boolean, default: false }
    , fbBoosted                             : { type: Boolean, default: false }
    , fbBoostedExpired                      : { type: Date }
    , apartmatePartialProfile               : { type: Boolean, default: false }
    , apartmateListingCreated               : { type: Boolean, default: false }
    , apartmatePartialListingCreated        : { type: Boolean, default: false }
    , sharedPropertySearchListingCreated    : { type: Boolean, default: false }
    , password               : String
    , propertyListing              : [{
        propertyId: String
        , title                 : String
        , description           : { type: String }
        , streetAddress         : { type: String }
        , postalCode            : { type: String }
        , rentAmount            : { type: Number }
        , bedrooms              : { type: String }
        , bathrooms             : { type: String }
        , published             : {type: Boolean, default: false}
        , publishedAt           : { type: Date }
        , addedImages           : [{
            url: String
            , thumbUrl : String
            , bytes: String
            , id: String
        }]

    }]
    , apartmateListingPreferences: [{
        numberOfSeekers      : {type: String}
        , groupType          : {type: String}
        , maxRent            : {type: String}
        , updatedAt              : { type: Date, default: Date.now }
    }]
    , sharedApartmentListingPreferences: [{
        numberOfSeekers      : {type: String}
        , groupType          : {type: String}
        , maxRent            : {type: String}
        , updatedAt              : { type: Date, default: Date.now }
    }]
    , featuresPreferences              : [{
        name: String
        , id: String
    }]
    , lookingForPreferences            : [{
        name: String
        , id: String
    }]
    , buildingPreferences            : [{
        name: String
        , id: String
    }]
    , gender                        : [{
        name: String
        , id: String
    }]
    , contactPreferences            : [{
        name: String
        , id: String
    }]
    , bedroomPreferences            : [{
        name: String
        , id: String
    }]
    , maxRent                       : { type: Number }
    , ageGroup                      : { type: String }
    , lifestyle                     : { type: String }
    , personalDescription           : { type: String }
    , apiToken               : {type: String, default: ''}  
    , fbId                   : {type: String, default: ''}
    , fbToken                : {type: String, default: ''}  
    , createdAt              : { type: Date, default: Date.now }
    , updatedAt              : { type: Date, default: Date.now }
    , provider: [{
        name: String
        , id: String
        , credentials:   mongoose.Schema.Types.Mixed
    }]
    , role: {
        bitMask              : Number 
        , title              : String
        }
    , addedProfileImages            : [{
        url: String
        , thumbUrl : String
        , id: mongoose.Schema.ObjectId 
    }]
    , favoriteProperties            : [{
        id: String
    }]
    , resetPasswordToken: String
    , resetPasswordExpires: Date 
});

//ApartmateUser.plugin(passportLocalMongoose);


// ApartmateUser.virtual('password').get(function() 
// {
//     return this._password;
// }).set(function(password) 
// {
//     this._password = password;
//     var salt = this.salt = bcrypt.genSaltSync(10);
//     this.hash = bcrypt.hashSync(password, salt);
// });

// ApartmateUser.pre('save', function(next) 
// {
//     var user = this;
//     var SALT_FACTOR = 5;

//     if (!user.isModified('password')) 
//         return next();

//     bcrypt.genSalt(SALT_FACTOR, function(err, salt) 
//     {
//         if (err)
//             return next(err);

//         bcrypt.hash(user.password, salt, null, function(err, hash) 
//         {
//             if (err) return next(err);
//                 user.password = hash;
        
//             next();
//         });
//     });
// });

// var decipher = crypto.createDecipher(algorithm, key);
// var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

// ApartmateUser.pre('save', function(next) 
// {
//     var user = this;

//     if (!user.isModified('password')) 
//         return next();


//     var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
//     var key = 'password';
//     var text = 'I love kittens';

//     var cipher = crypto.createCipher(algorithm, user.password);  
//     var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
//     user.password = encrypted;
    
//     next();

// });


module.exports = {
    verifyPassword: function(password, callback) 
    {
        bcrypt.compare(password, this.hash, callback);
    }
};

// ApartmateUser.method('verifyPassword', function(password, callback) {
//     bcrypt.compare(password, this.hash, callback);
// });

// ApartmateUser.path("email").validate(function(value) {
//     try {
//         check(value).isEmail();
//         return true;
//     } catch(e) {
//         return false;
//     }
// }, 'Invalid email');


module.exports = mongoose.model('ApartmateUser', ApartmateUser);
