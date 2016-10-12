var _ = require('underscore');
var check = require('validator').check
var RSVP = require('rsvp');
var mongoose = require('mongoose');
var config = require('../../config');
var moment = require('moment');
var ApartmateUser = require('./ApartmateUser.js');

function calcImp(importance){
    switch(importance){
        case 0:
            return 1;
            break;
        case 1:
            return 10;
            break;
        case 2:
            return 250;
            break;
    }
}

function matchmakingProperties(users, email) {

    promise = new RSVP.Promise(function(resolve, reject){
        if(email == ''){
            reject("no match making needed");
        } else {
            ApartmateUser.findOne({ 'emailAddress': email}).lean().exec(function(err, endUser){

                endUser.impDenom = 0;

                for(var x in endUser.questionsResults) {
                    endUser.impDenom += calcImp(endUser.questionsResults[x].importance);
                }

                // Loop through Users
                for(i=0;i<users.length; i++){

                  // users[i] = users[i].toObject();

                  if(typeof users[i].questionsResults == "undefined")
                    users[i].percent = 0;
                  else {

                    endUser.impNumer = 0;
                    users[i].impNumer = 0;
                    users[i].impDenom = 0;


                    // Loop through each users question
                    for(j=0;j< users[i].questionsResults.length; j++){

                      users[i].impDenom += calcImp(users[i].questionsResults[j].importance);

                      // Check if question exists
                      for(var x in endUser.questionsResults) {

                        if(endUser.questionsResults[x].qid == users[i].questionsResults[j].qid){

                          // user -> endUser
                          for(var k in users[i].questionsResults[j].acceptable){
                            if(users[i].questionsResults[j].acceptable[k].id == endUser.questionsResults[x].answer && users[i].questionsResults[j].importance != -1){
                              users[i].impNumer += calcImp(users[i].questionsResults[j].importance);
                              break;
                            } 
                          }
                          
                          // endUser -> user
                          for(var l in endUser.questionsResults[j].acceptable){
                            if(endUser.questionsResults[x].acceptable[l].id == users[i].questionsResults[j].answer && endUser.questionsResults[j].importance != -1){
                              endUser.impNumer += calcImp(endUser.questionsResults[x].importance);
                            }          
                          }

                        }
                      }
                    }

                    users[i].percent = Math.round(Math.sqrt((users[i].impNumer / users[i].impDenom ) * (endUser.impNumer / endUser.impDenom )) * 100);
                    delete users[i].impDenom;
                    delete users[i].impNumer;

                  }

                }

                users.sort(function(a,b){
                  return b.percent - a.percent;
                });
                

                resolve(users);
            });
            
        }
    });

    return promise;
}

module.exports = {
    updateApartmateListing: function(apartmate, callback) {
        console.log('updateApartmateListing');

        ApartmateUser.findOne({ 'emailAddress': apartmate.emailAddress}, function (err, existingUser) 
        { 
            
            if (err || !existingUser)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                console.log('existingUser exists here ');
                
                existingUser.firstName = apartmate.firstName;
                existingUser.selectedGender = apartmate.selectedGender;

                if (!apartmate.ageGroup)
                    existingUser.ageGroup = apartmate.selectedAgeGroup;
                else 
                    existingUser.ageGroup  = apartmate.ageGroup;

                existingUser.availabilityDate = apartmate.availablityDate;
                
                existingUser.apartmatePartialProfile = true;
                existingUser.lifestyle = apartmate.selectedLifestyle;
                existingUser.phoneNumber = apartmate.phoneNumber;
                existingUser.maxRent = apartmate.maxRent;
                existingUser.updatedAt = new Date().toISOString();
                existingUser.save(function(err, userSaved)
                {
                    if (!err)
                        callback(null, userSaved);
                    else 
                        callback('Could not save part 1', null);
                });

            }
        });
   
    },


    updateAndFinish: function(apartmate, callback) {
        console.log('updateAndFinish');
        // Find property listing
       
        ApartmateUser.findById(apartmate._id, function (err, existingApartmate) 
        { 
            
            if (err || !existingApartmate)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                console.log(apartmate);

                //existingApartmate.emailAddress = apartmate.emailAddress;
                existingApartmate.personalDescription = apartmate.personalDescription;
                
                if(existingApartmate.apartmatePartialProfile == true){
                    // existingApartmate.profileCreated = true;
                    existingApartmate.apartmateListingCreated = true;
                }

                console.log('existingApartmate.apartmateListingCreated: ' + existingApartmate.apartmateListingCreated);
                existingApartmate.updatedAt = Date.now();
                existingApartmate.save(function(err, apartmateSaved)
                {
                    if (!err)
                    {
                        console.log('apartmateSaved.apartmateListingCreated 2: ' + apartmateSaved.apartmateListingCreated);
                        callback(null, apartmateSaved);
                    }
                    else 
                        callback('Could not save part 2', null);
                });

            }
        });
   
    },

    removeExistingPictures: function(apartmate, callback) {
        console.log('updateApartmateListing');

        ApartmateUser.findById(apartmate._id, function (err, existingUser) 
        { 
            
            if (err || !existingUser)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                console.log('existingUser exists here ');
                
                for (var i = 0; i < existingUser.addedProfileImages.length; i++)
                {

                    if (existingUser.addedProfileImages[i].url === apartmate.filename)
                        existingUser.addedProfileImages.splice(i, 1);
                }
                existingUser.apartmatePartialListingCreated = true;
                existingUser.save(function(err, userSaved)
                {
                    if (!err)
                        callback(null, userSaved);
                    else 
                        callback('Could not save part 2 after removing image', null);
                });

            }
        });
   
    },

    updateApartmateListingWithSharedSearch: function(apartmate, callback) {
        console.log('updateApartmateListing');

        ApartmateUser.findOne({ 'emailAddress': apartmate.emailAddress}, function (err, existingUser) 
        { 
            
            if (err || !existingUser)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                console.log('existingUser exists here ');
                //resolve(property);

                var listingPreference = {
                    numberOfSeekers: apartmate.selectedNumberOfSeekers,
                    groupType: apartmate.selectedGroupType,
                    maxRent: apartmate.rentAmount
                };
                
                existingUser.apartmateListingPreferences.push(listingPreference);

                for (var key in apartmate.preferredFeatures) {
                    var obj = apartmate.preferredFeatures[key];

                    if (obj === true)
                        existingUser.featuresPreferences.push({"name": key});
                }

                for (var key in apartmate.bedroomPreferences) {
                    var obj = apartmate.bedroomPreferences[key];

                    if (obj === true)
                        existingUser.bedroomPreferences.push({"name": key});
                }

                for (var key in apartmate.buildingPreferences) {
                    var obj = apartmate.buildingPreferences[key];

                    if (obj === true)
                        existingUser.buildingPreferences.push({"name": key});
                }



                existingUser.save(function(err, userSaved)
                {
                    if (!err)
                        callback(null, userSaved);
                    else 
                        callback('Could not save part 1', null);
                });

            }
        });
   
    },

    updateAndFinishWithSharedSearch: function(apartmate, callback) {
        console.log('updateAndFinishWithSharedSearch');
        console.log('Name: ' + apartmate.displayName);
        // Find property listing
       
        ApartmateUser.findById(apartmate._id, function (err, existingApartmate) 
        { 
            
            if (err || !existingApartmate)
            {
                console.log('err: ' + err);
               // resolve("");
            }
            else {
                
                existingApartmate.displayName = apartmate.displayName;
                existingApartmate.ageGroup = apartmate.selectedAgeGroup;
                existingApartmate.lifestyle = apartmate.selectedLifestyle;
                existingApartmate.sharedPropertySearchListingCreated = true;
                existingApartmate.personalDescription = apartmate.personalDescription;

                for (var key in apartmate.contactPreferences) {
                    var obj = apartmate.contactPreferences[key];

                    if (obj === true)
                        existingApartmate.contactPreferences.push({"name": key});
                }

                for (var key in apartmate.gender) {
                    var obj = apartmate.gender[key];

                    if (obj === true)
                        existingApartmate.gender.push({"name": key});
                }


                existingApartmate.save(function(err, apartmateSaved)
                {
                    if (!err)
                        callback(null, apartmateSaved);
                    else 
                        callback('Could not save part 2', null);
                });

            }
        });
   
    },

    findListingByAddress: function(emailAddress) {
        var promise = new RSVP.Promise(function(resolve, reject)
        {
            PropertyListing.findOne({ 'streetAddress': streetAddress}, function (err, property) 
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
            PropertyListing.findById(id, function (err, property) 
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
    getApartmateListing: function(emailAddress, callback)
    {
        ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, apartmate) 
            { 
                
                if (err || !apartmate)
                {
                    callback(err, null);
                }
                else {
                    console.log('apartmate exists at this firstName: ' + apartmate.firstName);
                    callback(null, apartmate);
                }
            });
    
    },
    updateActiveProfile: function(email, callback)
    {

        console.log(email);
        console.log("TEST");

        ApartmateUser.findOne({ 'emailAddress': email}, function (err, existingApartmate) 
            { 
                
                if (err || !existingApartmate)
                {    
                    callback(err, null);
                }
                else {
                    console.log('apartmate exists at this firstName: ' + existingApartmate.firstName);
                    console.log(existingApartmate);
                    existingApartmate.activeProfile = !existingApartmate.activeProfile;

                    existingApartmate.save(function(err, savedApartmate)
                    {
                        if (!err)
                            callback(null, savedApartmate);
                        else 
                            callback('Could not update Apartmate User', null);
                    });
                }
            });
    
    },

    dismissFBModal: function(email, callback)
    {

        console.log(email);
        console.log("TEST");

        ApartmateUser.findOne({ 'emailAddress': email}, function (err, existingApartmate) 
            { 
                
                if (err || !existingApartmate)
                {    
                    callback(err, null);
                }
                else {
                    console.log('apartmate exists at this firstName: ' + existingApartmate.firstName);

                    existingApartmate.fbModalInit = true;

                    existingApartmate.save(function(err, savedApartmate)
                    {
                        if (!err)
                            callback(null, savedApartmate);
                        else 
                            callback('Could not update Apartmate User', null);
                    });
                }
            });
    
    },
    getApartmateListingsByFilter: function(filterParameters, email, callback)
    {

        console.log('getApartmateListingsByFilter under ApartmateListing');
        console.log('filterParameters.gender: ' + filterParameters.gender);
        console.log(filterParameters);
        // Gender
        if (filterParameters.gender != 'ALL')
        {
            filter_gender = filterParameters.gender.toLowerCase();
            console.log('Filter by this gender: ' + filterParameters.gender);
        } else {
            filter_gender = /^/i;
        }

        // Age
        if (filterParameters.age != 'ALL')
        {
            filter_age = filterParameters.age;
            console.log('Filter by this age: ' + filterParameters.age);
        } else {
            filter_age = /^/i;
        }

        // Price 
        filter_minPrice = Number(filterParameters.budget.minPrice);
        filter_maxPrice = Number(filterParameters.budget.maxPrice);
        console.log('Filter by this min Price: ' + filter_minPrice);
        console.log('Filter by this max Price: ' + filter_maxPrice);

        console.log(filterParameters.availabilityDateApartmate);

        // // Dates 
        if (filterParameters.availabilityDateApartmate != 'ALL')
        {
            var filter_date = new Date(filterParameters.availabilityDateApartmate);
        } else {
            var filter_date = new Date();
            filter_date.setMonth(filter_date.getMonth() - 1);
        }

        //console.log('filter_minPrice: ' + filter_minPrice);

         // ApartmateUser.find({ $and: [ 
         //    { 'maxRent': { $lte: filter_maxPrice } }, 
         //    { 'availabilityDate': { $gte: filter_date } } 
         //    ] })
         //    .sort( { 'maxRent': 1 } )
         //    .where('gender.name', filter_gender)
         //    .where('ageGroup', filter_age)
         //    .exec(
         //        function (err, apartmates) 
         //        { 
                    
         //            if (err || !apartmates)
         //            {
         //                callback("No apartmates found", null);
         //            }
         //            else {
         //                console.log('Number of apartmates retrieved: ' + apartmates.length);
         //                callback(null, apartmates);
         //            }
         //    });
        
        console.log('filter_maxPrice: ' + filter_maxPrice);
        console.log('selectedGender: ' + filter_gender);
        console.log('ageGroup: ' + filter_age);

        
        ApartmateUser.find({ $and: [
            { 'maxRent': { $gte: filter_minPrice }},
            { 'maxRent': { $lte: filter_maxPrice }},
            { 'availabilityDate': {$gte: filter_date}},
            { 'activeProfile': true }
            ] })
            .sort( { 'maxRent': 1 } )
            .where('selectedGender', filter_gender)
            .where('ageGroup', filter_age)
            .lean()
            .exec(
                function (err, apartmates) {
                    
                    if (err || !apartmates)
                    {
                        callback("No apartmates found", null);
                    }
                    else {
                        console.log('Number of apartmates retrieved: ' + apartmates.length);
                        matchmakingProperties(apartmates, email).then(function(apartmatesMatched) {
                            console.log("Matched Properites");
                            callback(null, apartmatesMatched);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        }, function(err) {
                            console.log(err);
                            // callback(null, properties);
                            callback(null, apartmates);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        });
                    }
        });
       
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
    }

};