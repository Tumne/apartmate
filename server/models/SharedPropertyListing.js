var _ = require('underscore');
var check = require('validator').check;
var RSVP = require('rsvp');
var async =  require('async');

var mongoose = require('mongoose');
var config = require('../../config');
var moment = require('moment');
var GatheredListings = require('./GatheredListings.js');
var ApartmateUser = require('./ApartmateUser.js');


//var db = mongoose.connect(config.development.dbUrl);

module.exports = {
    addOrUpdate: function(property, location, callback) {
        console.log('addOrUpdate under the model');
        // Create new property listing
        var newProperty = GatheredListings();
        newProperty.propertyFriendlyId = '';
       //newProperty.createdById = property.userId;
        console.log('property.userId;: ' + property.userId);
        //console.log('property: ' + property);
        console.log('propertyTypeSelected: ' + property.propertyTypeSelected);
        newProperty.createdById = property.userId;
        newProperty.propertyType = "Shared";
        newProperty.buildingType = property.propertyTypeSelected;
        newProperty.basementApartment = property.isBasementApartment;
        newProperty.bedrooms = property.selectedBedrooms;
        newProperty.bathrooms = property.selectedBathrooms;
        newProperty.streetAddress = property.streetAddress;
        newProperty.unitNumber = property.unitNumber;
        newProperty.postalCode = property.postalCode;
        newProperty.rentAmount = property.rentAmount;
        newProperty.email = property.email;
        newProperty.availabilityDate = property.dt;
        newProperty.leaseTermsAvailable.push({"name": property.selectedLeaseTerm});
        newProperty.couplesWelcome.push({"name": property.selectedCouples});
        newProperty.petsWelcome.push({"name": property.selectedPets});
        newProperty.LGBTWelcome.push({"name": property.selectedLGBT});


        for (var key in property.utilities) {
            var obj = property.utilities[key];

            if (obj === true)
                newProperty.utlitiesIncluded.push({"name": key});
        }

        for (var key in property.features) {
            var obj = property.features[key];

            if (obj === true)
                newProperty.featuresIncluded.push({"name": key});
        }

        if(location != '')
        {
            newProperty.location.lat = location["results"][0]["geometry"]["location"]["lat"];
            newProperty.location.lon = location["results"][0]["geometry"]["location"]["lng"];
        }

        // Save new property listing
        newProperty.save(function(err, newPropertyCreated) 
        {
            if (err)
            {
                console.log('Error with adding new property listing: ' + err);
                callback('Property Listing Creation failed', null);
            } else 
            {
                console.log('New Property Listing was created');
                callback(null, newPropertyCreated);
            }
        });
       
    },

    editListing: function(property, location, callback) {

        console.log('property._id: ' + property._id);
        GatheredListings.findById(property._id, function (err, existingProperty) 
        { 

            if (err || !existingProperty)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {

                    console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                    //resolve(property);

                    if(location != '')
                    {
                        existingProperty.location.lat = location["results"][0]["geometry"]["location"]["lat"];
                        existingProperty.location.lon = location["results"][0]["geometry"]["location"]["lng"];
                    }

                    existingProperty.propertyType = "Shared";
                    existingProperty.buildingType = property.propertyTypeSelected;
                    existingProperty.basementApartment = property.isBasementApartment;
                    existingProperty.bedrooms = property.selectedBedrooms;
                    existingProperty.bathrooms = property.selectedBathrooms;
                    existingProperty.streetAddress = property.streetAddress;
                    existingProperty.unitNumber = property.unitNumber;
                    existingProperty.postalCode = property.postalCode;
                    existingProperty.rentAmount = property.rentAmount;

                    existingProperty.availabilityDate = property.dt;

                    existingProperty.leaseTermsAvailable = new Array();
                    existingProperty.petsWelcome = new Array();
                    existingProperty.couplesWelcome = new Array();
                    existingProperty.utlitiesIncluded = new Array();
                    existingProperty.featuresIncluded = new Array();

                    existingProperty.leaseTermsAvailable.push({"name": property.selectedLeaseTerm});
                    existingProperty.petsWelcome.push({"name": property.selectedPets});
                    existingProperty.couplesWelcome.push({"name": property.selectedCouples});
                    existingProperty.LGBTWelcome.push({"name": property.selectedCouples});

                    for (var key in property.utilities) {
                        var obj = property.utilities[key];

                        if (obj === true)
                            existingProperty.utlitiesIncluded.push({"name": key});
                    }

                    for (var key in property.features) {
                        var obj = property.features[key];

                        if (obj === true)
                            existingProperty.featuresIncluded.push({"name": key});
                    }


                    existingProperty.save(function(err, propertySaved)
                    {
                        if (!err){
                            console.log('Property Listing updated');
                            callback(null, propertySaved);
                        }
                        else {
                            callback('Could not edit Listing Part 1', null);
                        }
                    });

            }
        });
       
    },

    updateDescription: function(property, callback) {
        console.log('update under the updateDescription');
        console.log('Desc: ' + property.description);
        // Find property listing
       
        GatheredListings.findById(property._id, function (err, existingProperty) 
        { 
            
            if (err || !existingProperty)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                //resolve(property);

                existingProperty.description = property.description;
                existingProperty.title = property.title;

                existingProperty.save(function(err, propertySaved)
                {
                    if (!err)
                        callback(null, propertySaved);
                    else 
                        callback('Could not save part 2', null);
                });

            }
        });
   
    },

    updateAndFinish: function(property, apartmate, callback) {
        console.log('updateAndFinish');
        console.log(apartmate);

        var fn1 = function(done){

            GatheredListings.findById(property._id, function (err, existingProperty) 
            { 
                
                if (err || !existingProperty)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                    console.log(existingProperty);

                    //resolve(property);
                    existingProperty.apartmateUserId = apartmate._id;
                    existingProperty.name = apartmate.name;
                    existingProperty.email = apartmate.emailAddress;
                    existingProperty.phone = apartmate.phone;
                    existingProperty.ageGroup = apartmate.selectedAgeGroup;
                    existingProperty.lifestyle = apartmate.selectedLifestyle;
                    existingProperty.personalGender = apartmate.selectedGender;
                    existingProperty.personalDescription = apartmate.personalDescription;
                    existingProperty.published = property.published;

                    for(var key in apartmate.questionsResults)
                        existingProperty.questionsResults.push(apartmate.questionsResults[key]);

                    for (var key in property.gender) {
                        var obj = property.gender[key];

                        if (obj === true)
                            existingProperty.gender.push({"name": key});
                    }

                    for (var key in property.contactPreferences) {
                        var obj = property.contactPreferences[key];

                        if (obj === true)
                            existingProperty.contactPreferences.push({"name": key});
                    }

                    existingProperty.save(function(err, propertySaved)
                    {
                        if (!err){

                            done(null, propertySaved);
                        }
                        else 
                            callback('Could not save part 2', null, null);
                    });

                }
            });
        };

        var fn2 = function(propertySaved, done){

            ApartmateUser.findOne({ 'emailAddress': apartmate.emailAddress}, function (err, existingUser) 
            { 
                
                if (err || !existingUser)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('existingUser exists here ');

                    existingUser.firstName = apartmate.name;
                    existingUser.username = apartmate.name;
                    existingUser.selectedGender = apartmate.selectedGender;
                    existingUser.ageGroup = apartmate.selectedAgeGroup;
                    existingUser.lifestyle = apartmate.selectedLifestyle;
                    existingUser.personalDescription = apartmate.personalDescription;

                    existingUser.propertyListing.push({
                        "propertyId": propertySaved._id,
                        "title": propertySaved.title,
                        "description": propertySaved.description,
                        "streetAddress": propertySaved.streetAddress,
                        "postalCode": propertySaved.postalCode,
                        "rentAmount": propertySaved.rentAmount,
                        "bedrooms": propertySaved.bedrooms,
                        "bathrooms": propertySaved.bathrooms,
                        "published": propertySaved.published,
                        "publishedAt": propertySaved.updatedAt,
                        "addedImages": propertySaved.addedImages
                    });

                    existingUser.updatedAt = new Date().toISOString();
                    existingUser.save(function(err, userSaved)
                    {
                        if(err)
                            callback('Could not save Apartmate', null);

                        done(null, propertySaved, userSaved);

                    });

                }
            });

        };



        async.waterfall([fn1, fn2], function(err, propertySaved, userSaved){
            console.log('propertySaved and userSaved successfully');
            callback(null, propertySaved, userSaved);
        });
   
    },



    findListingByAddress: function(emailAddress) {
        var promise = new RSVP.Promise(function(resolve, reject)
        {
            GatheredListings.findOne({ 'streetAddress': streetAddress}, function (err, property) 
            { 
                
                if (err || !property)
                {
                    resolve("");
                }
                else {
                    console.log('Property exists at this street address: ' + property.streetAddress);
                    resolve(property);
                }
            });
        });

        return promise;
    },

    findListingById: function(id) {
        var promise = new RSVP.Promise(function(resolve, reject)
        {
            GatheredListings.findById(id, function (err, property) 
            { 
                
                if (err || !property)
                {
                    resolve("");
                }
                else {
                    console.log('Property exists at this street address: ' + property.streetAddress);
                    resolve(property);
                }
            });
        });

        return promise;
    },

    validate: function(propertyListing) {
        /*
        check(propertyListing.streetAddress, 'You need a valid street address. This information will be used to map your property. It will not be displayed to users.').isEmail();
        check(propertyListing.postalCode, 'That is totally not a secure password. Choose at least 5 characters').len(5, 60);
        //check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
        */
        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        //var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        //check(user.role, 'Invalid user role given').isIn(stringArr);
    },

};