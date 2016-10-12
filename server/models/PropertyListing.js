var _ = require('underscore');
var check = require('validator').check
var RSVP = require('rsvp');
var moment = require('moment');
//var WholeProperty = require('./WholeProperty.js');
var GatheredListings = require('./GatheredListings.js');
var ApartmateUser = require('./ApartmateUser.js');

var async = require('async');


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

function sortFeaturedProperties(users){
    var boostedUsers = [];
    var nonBoostedUsers = [];
    var currentDate = new Date();
    // fbBoostedExpired
    for(i=0;i<users.length; i++){
        if(users[i].fbBoosted && users[i].fbBoostedExpired >= currentDate) {
            boostedUsers.push(users[i]);
        } else {
            nonBoostedUsers.push(users[i]);
        }
    };
    
    if(boostedUsers.length > 0){
        users = boostedUsers.concat(nonBoostedUsers);
    }

    return users;
}

function matchmakingProperties(users, email) {
    console.log(email);
    promise = new RSVP.Promise(function(resolve, reject){
        if(typeof email == "undefined" || email === ''){

            resolve(sortFeaturedProperties(users));

        } else {
            ApartmateUser.findOne({ 'emailAddress': email}).lean().exec(function(err, endUser){

                console.log(endUser);

                endUser.impDenom = 0;
                for(var x in endUser.questionsResults) {
                    endUser.impDenom += calcImp(endUser.questionsResults[x].importance);
                }

                // Loop through Users
                for(i=0;i<users.length; i++){

                  // users[i] = users[i].toObject();

                  if(typeof users[i].questionsResults == "undefined" || users[i].questionsResults.length === 0){
                    users[i].percent = 0;
                  } else {

                    endUser.impNumer = 0;
                    users[i].impNumer = 0;
                    users[i].impDenom = 0;
                        
                    if(users[i].questionsResults.length >= 5){
                      // Quick Fix
                      for(j=0;j< 5; j++){

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

                    } else {
                      users[i].percent = 0;
                    }
                    
                    delete users[i].impDenom;
                    delete users[i].impNumer;

                    console.log('');
                    console.log(users[i].name);
                    console.log(users[i].email);
                    console.log('Questions Results No:', users[i].questionsResults.length);

                    console.log('Percent: ', users[i].percent);

                  }

                }
                // console.log("!!!!!!! Unsorted Users");
                // for(i=0;i<users.length; i++){
                //     if(isNaN(users[i].percent)){
                //         users[i].percent = 0;
                //     }
                // }
                users.sort(function(a,b){
                  return b.percent - a.percent;
                });

                resolve(sortFeaturedProperties(users));

            });
            
        }
    });

    return promise;
}

module.exports = {
    getListingByPolygon: function(filterParameters)
    {

        var promise = new RSVP.Promise(function(resolve, reject)
        {
            GatheredListings.find({ $and: [ { 'rentAmount': { $gte: filterParameters.minPrice } }, { 'rentAmount': { $lte: filterParameters.maxPrice } }, { 'availabilityDate': { $gte: filterParameters.date } } ] })
            .sort( { 'rentAmount': 1 } )
            .where('location').within().geometry({ type: 'Polygon', coordinates: filterParameters.coordinates } )
            .where('bedrooms', filterParameters.bedrooms)
            .where('propertyType', filterParameters.propertyType)
            .exec(
                function (err, properties) 
                { 
                        
                    if (err || !properties)
                    {
                        resolve("");
                    }
                    else {
                        console.log('Number of properties retrieved: ' + properties.length);
                        resolve(property);
                    }
            });

        });

        return promise;
    },

    addOrUpdate: function(property, location, callback) {
        
        console.log('addOrUpdate under the model');
        // Create new property listing
        var newProperty = GatheredListings();
        newProperty.propertyFriendlyId = '';
        console.log('property.user ID: ' + property.userId);
        newProperty.createdById = property.userId;


        newProperty.propertyType = "Entire";
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
        newProperty.petsWelcome.push({"name": property.selectedPets});

        if(location != '')
        {
            newProperty.location.lat = location["results"][0]["geometry"]["location"]["lat"];
            newProperty.location.lon = location["results"][0]["geometry"]["location"]["lng"];
        }

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
                    existingProperty.propertyType = "Entire";
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
                    existingProperty.utlitiesIncluded = new Array();
                    existingProperty.featuresIncluded = new Array();

                    existingProperty.leaseTermsAvailable.push({"name": property.selectedLeaseTerm});
                    existingProperty.petsWelcome.push({"name": property.selectedPets});

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
    deleteListing: function(id, callback){
        console.log('delete listing');
        console.log('Property ID: ' + id);  

        // GatheredListings.findById(id, function (err, existingProperty) 
        // { 
        //     // console.log(existingProperty);
        //     if (err || !existingProperty)
        //     {
        //         console.log('err: ' + err);
        //        // resolve("");
        //     }
        //     else {
        //         console.log('Property exists at this street address: ' + existingProperty.streetAddress);

        //         existingProperty.remove(function(err)
        //         {
        //             if (!err)
        //                 callback(null);
        //             else 
        //                 callback('Could not delete property');
        //         });

        //     }
        // });      

        var fn1 = function(done){

            GatheredListings.findById(id, function (err, existingProperty) 
            { 
                console.log(existingProperty);
                if (err || !existingProperty)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('Property exists at this street address: ' + existingProperty.streetAddress);

                    existingProperty.remove(function(err)
                    {
                        if (!err)
                            // callback(null);
                            done(null, existingProperty.email);
                        else 
                            callback('Could not delete property');
                    });

                }
            }); 

        };

        var fn2 = function(emailAddress, done){

            ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser) 
            { 
                
                if (err || !existingUser)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('existingUser exists here ');
                    console.log(existingUser.propertyListing);
                    var index = -1;
                    for(var i = 0; i < existingUser.propertyListing.length; i++){
                        if(existingUser.propertyListing[i].propertyId == id)
                            index = i;
                    }

                    if(index > -1){
                       existingUser.propertyListing.splice(index, 1);
                    }
                    console.log(existingUser.propertyListing);

                    existingUser.save(function(err, userSaved)
                    {
                        if(err)
                            callback('Could not save Apartmate', null);

                        done(null);

                    });

                }
            });

        };

        async.waterfall([fn1, fn2], function(err){
            callback(null);
        });

    },
    updatePublish: function(id, callback){
        console.log('delete listing');
        console.log('Property ID: ' + id);



        var fn1 = function(done){

            GatheredListings.findById(id, function (err, existingProperty) 
            { 
                // console.log(existingProperty);
                if (err || !existingProperty)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                    console.log(existingProperty.published);

                    existingProperty.published = !existingProperty.published;
                    if(existingProperty.published){
                        existingProperty.publishedAt = Date();
                    } else {
                        existingProperty.publishedAt = null;
                    }
                    existingProperty.save(function(err, propertySaved)
                    {
                        if (!err)
                            done(null, existingProperty.email, existingProperty);
                        else 
                            callback('Could not update published property listing');
                    });

                }
            });

            // GatheredListings.findById(id, function (err, existingProperty) 
            // { 
            //     console.log(existingProperty);
            //     if (err || !existingProperty)
            //     {
            //         console.log('err: ' + err);
            //        // resolve("");
            //     }
            //     else {
            //         console.log('Property exists at this street address: ' + existingProperty.streetAddress);

            //         existingProperty.remove(function(err)
            //         {
            //             if (!err)
            //                 // callback(null);
            //                 done(null, existingProperty.email);
            //             else 
            //                 callback('Could not delete property');
            //         });

            //     }
            // }); 

        };

        var fn2 = function(emailAddress, propertySaved, done){

            ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser)
            {
                
                if (err || !existingUser)
                {
                    console.log('err: ' + err);
                   // resolve("");
                }
                else {
                    console.log('existingUser exists here ');
                    console.log(existingUser.propertyListing);
                    var index = -1;
                    for(var i = 0; i < existingUser.propertyListing.length; i++){
                        if(existingUser.propertyListing[i].propertyId == propertySaved._id)
                            existingUser.propertyListing[i].published = propertySaved.published;
                    }

                    console.log(existingUser.propertyListing);

                    existingUser.save(function(err, userSaved)
                    {
                        if(err)
                            callback('Could not save Apartmate', null);

                        done(null, propertySaved);

                    });

                }
            });

        };

        async.waterfall([fn1, fn2], function(err, propertySaved){
            callback(null, propertySaved);
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

    removeExistingPictures: function(property, callback) {

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

                

                for (var i = 0; i < existingProperty.addedImages.length; i++)
                {

                    if (existingProperty.addedImages[i].url === property.filename)
                        existingProperty.addedImages.splice(i, 1);
                }
                
                existingProperty.save(function(err, propertySaved)
                {
                    if (!err)
                        callback(null, propertySaved);
                    else 
                        callback('Could not save part 2 after removing image', null);
                });

            }
        });
    },

    // updateAndFinish: function(property, callback) {
    //     console.log('updateAndFinish');
    //     console.log('Name: ' + property.name);
    //     console.log('Landlordtype: ' + property.landlordType);
    //     // Find property listing
       
    //     GatheredListings.findById(property._id, function (err, existingProperty) 
    //     { 
            
    //         if (err || !existingProperty)
    //         {
    //             console.log('err: ' + err);
    //            // resolve("");
    //         }
    //         else {
    //             console.log('Property exists at this street address: ' + existingProperty.streetAddress);
    //             //resolve(property);

    //             //existingProperty.name = property.name;
    //             existingProperty.email = property.emailAddress;
    //             existingProperty.phone = property.phone;
    //             existingProperty.landlordType = property.landlordType;
    //             existingProperty.published = property.published;
    //             existingProperty.publishedAt = property.publishedAt;

    //             for (var key in property.contactPreferences) {
    //                 var obj = property.contactPreferences[key];

    //                 if (obj === true)
    //                     existingProperty.contactPreferences.push({"name": key});
    //             }

    //             existingProperty.save(function(err, propertySaved)
    //             {
    //                 if (!err)
    //                     callback(null, propertySaved);
    //                 else 
    //                     callback('Could not save part 3', null);
    //             });

    //         }
    //     });
   
    // },

    updateAndFinish: function(property, apartmate, callback) {
        console.log('updateAndFinish');
        console.log(property);
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

                    //resolve(property);

                    existingProperty.name = apartmate.name;
                    existingProperty.email = apartmate.emailAddress;
                    existingProperty.landlordType = property.landlordType;
                    existingProperty.personalDescription = apartmate.personalDescription;
                    existingProperty.published = property.published;
                    console.log('existingProperty');
                    console.log(existingProperty);
                    
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
                    console.log(existingUser);
                    existingUser.firstName = apartmate.name;
                    existingUser.username = apartmate.name;
                    existingUser.personalDescription = apartmate.personalDescription;
                    var propExists = false;
                    var propIndex = null;

                    if(propExists){
                        console.log("updating correct!");
                        existingUser.propertyListing[propIndex].propertyId = propertySaved._id;
                        existingUser.propertyListing[propIndex].title = propertySaved.title;
                        existingUser.propertyListing[propIndex].description = propertySaved.description;
                        existingUser.propertyListing[propIndex].streetAddress = propertySaved.streetAddress;
                        existingUser.propertyListing[propIndex].postalCode = propertySaved.postalCode;
                        existingUser.propertyListing[propIndex].rentAmount = propertySaved.rentAmount;
                        existingUser.propertyListing[propIndex].bedrooms = propertySaved.bedrooms;
                        existingUser.propertyListing[propIndex].bathrooms = propertySaved.bathrooms;
                        existingUser.propertyListing[propIndex].published = propertySaved.published;
                        existingUser.propertyListing[propIndex].publishedAt = propertySaved.publishedAt;
                        existingUser.propertyListing[propIndex].addedImages = propertySaved.addedImages;

                    } else {
                        console.log("ADding incorrect!");
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
                            "publishedAt": propertySaved.publishedAt,
                            "addedImages": propertySaved.addedImages
                        });                        
                    }


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


        // if (err) throw err;
        async.waterfall([fn1, fn2], function(err, propertySaved, userSaved){
            console.log(propertySaved);
            console.log(userSaved);
            callback(null, propertySaved, userSaved);
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

    

    findManyByUserId: function(userId, callback)
    {
        
        console.log('userId: ' + userId);
        GatheredListings.find({ 'createdById': userId}, function (err, properties) 
        { 
            
            if (err || !properties)
            {
                callback("No properties found", null);
            }
            else {
                console.log('found properties: ' + properties.length);
                callback(null, properties);
            }
        });
  
    },

    findListingById: function(id, callback) {
        // var promise = new RSVP.Promise(function(resolve, reject)
        // {
        GatheredListings.findById(id, function (err, property) 
        { 
            
            if (err || !property)
            {
                // resolve("");
                callback("No properties found", null);
            }
            else {
                console.log('Property exists at this street address: ' + property.streetAddress);
                // console.log(property)
                callback(null, property);
            }
        });
        // });

        // return promise;
    },

    findListingByUserId: function(id, callback) {
        console.log('findListingByUserId - id: ' + id);
        
        GatheredListings.find({'createdById': id}, function (err, properties) 
        { 
            
            if (err || !properties)
            {
                console.log('findListingByUserId - error')
                callback('PropertyNotFound', null);
            }
            else {
                console.log('findListingByUserId - Properties found');

                callback(null, properties[properties.length-1]);
            }
        });
        
    },

    updateFBBoost: function(id, callback) {
        console.log('findListingByUserId - id: ' + id);
        
        GatheredListings.findById(id, function (err, existingProperty) 
        { 
            
            if (err || !existingProperty)
            {
                console.log('findListingByUserId - error')
                callback('PropertyNotFound', null);
            }
            else {
                console.log('findListingByUserId - Properties found');
                existingProperty.fbBoosted = true;
                
                var dateExpire = new Date();
                dateExpire.setDate(dateExpire.getDate()+7);
                existingProperty.fbBoostedExpired = dateExpire;

                existingProperty.save(function(err, propertySaved)
                {
                    if (!err){
                        callback(null, propertySaved);
                    }
                    else 
                        callback('Could not save part 2', null);
                });
            }
        });
        
    },
    findManyById: function(favoriteProperties, callback)
    {
        var ids = new Array();
        for(var i =0; i < favoriteProperties.length; i++)
        {
            ids.push(favoriteProperties[i]['id']);
            console.log('favoriteProperties[i].id): ' + favoriteProperties[i]['id']);
            console.log('favoriteProperties[i]._id): ' + favoriteProperties[i]['_id']);
        }

        GatheredListings.find({ '_id': { $in: ids }}, function (err, properties) 
        { 
            
            if (err || !properties)
            {
                callback("No properties found", null);;
            }
            else {
                console.log('found properties: ' + properties.length);
                callback(null, properties);
            }
        });
  
    },


    getAllProperties: function(requestType, callback)
    {
       
        // WholeProperty.find({}, function (err, properties) 
        // { 
            
        //     if (err || !properties)
        //     {
        //         callback("No properties found", null);
        //     }
        //     else {
        //         console.log('Number of properties retrieved: ' + properties.length);
        //         callback(null, properties);
        //     }
        // });

        if (requestType && requestType.coordinates)
        {
            
            //console.log('point: ' + requestType.coordinates.toString())
            var coordinatesArray = requestType.coordinates.toString().split(',');
            var geoArray = new Array();
            var geoSet = [];
            for (var c = 0; c < coordinatesArray.length; c+=2)
            {
                geoSet = [ parseFloat(coordinatesArray[c+1]), parseFloat(coordinatesArray[c]) ];
                geoArray.push(geoSet);
            }


            var coordinates = [ geoArray ];
            //var coordinates = [ [ [ 43.66725, -79.460291], [43.667343, -79.448275] , [43.671068, -79.429306], [43.654614, -79.422912 ], [43.650547, -79.442954], [43.651913, -79.445228], [43.66725, -79.460291] ]]
            //var polyA = [[[ 10, 20 ], [ 10, 40 ], [ 30, 40 ], [ 30, 20 ]]]
            GatheredListings.where('location').within().geometry({ type: 'Polygon', coordinates: coordinates }).exec(
                function(err, properties) {
                    if (err)
                        console.log('err: ' + err);
                    else
                    {
                        //console.log('Done: ' + result);
                        console.log('Number of properties retrieved: ' + properties.length);
                        callback(null, properties);
                    }
            });
        
        } else 
        {

            GatheredListings.where('location').within({ center: [43.653226,-79.38318429], radius: 100, unique: true, spherical: true }).exec(
                function (err, properties) 
                { 
                    
                    if (err || !properties)
                    {
                        callback("No properties found", null);
                    }
                    else {
                        console.log('Number of properties retrieved: ' + properties.length);
                        callback(null, properties);
                    }
            });
        }

       
    },

    
    getPropertyListingsByFilterApartmate: function(filterParameters, callback)
    {
       

        var petsCondition = "No";
        // Pets

        if (filterParameters.pets.cats === true && filterParameters.pets.dogs === true)
        {
            petsCondition = 'Yes';   
            console.log('Both pets');

        } else if (filterParameters.pets.cats === true)
        {
            petsCondition = 'cats only';   
            console.log('Cats only');
        } else if (filterParameters.pets.dogs === true)
        {
            petsCondition = 'dogs only';   
            console.log('Dogs only');
        }

        // Bedrooms
        if (filterParameters.bedrooms != 'ALL')
        {
            
            if (filterParameters.bedrooms == '1')
                filterParameters.bedrooms = '1 bedroom';
            else
                filterParameters.bedrooms = filterParameters.bedrooms + ' bedrooms';

            filter_bedrooms = filterParameters.bedrooms;
            console.log('Filter by this many bedrooms: ' + filterParameters.bedrooms);
        } else {
            filter_bedrooms = /^/i;
        }

        // Basement
        if (filterParameters.basementApartment != 'Yes')
        {
            filter_basementApartment_YES = "No";
            filter_basementApartment_NO = "No";
        } else {
            filter_basementApartment_YES = "Yes";
            filter_basementApartment_NO = "No";
        }

        // Bathrooms
        if (filterParameters.bathrooms != 'ALL')
        {
            
            if (filterParameters.bathrooms == '1') 
            {
                filterParameters.bathrooms = '1 bathroom';
                filter_shared_bathrooms = '1 shared bathroom';
                filter_two_bathrooms = '2 bathrooms';
                filter_two_half_bathrooms = '2.5 bathrooms';
                filter_3_plus_bathrooms = '3+ bathrooms';
                filter_private_bathrooms = '1 private bathroom';
            }
            else{

                filterParameters.bathrooms = filterParameters.bathrooms + ' bathrooms';
                filter_shared_bathrooms = filterParameters.bathrooms;
                filter_private_bathrooms = filterParameters.bathrooms;
                filter_two_bathrooms = filterParameters.bathrooms;
                filter_two_half_bathrooms = filterParameters.bathrooms;
                filter_3_plus_bathrooms = filterParameters.bathrooms;

                if (filterParameters.bathrooms === '2 bathrooms')
                {
                    filter_two_half_bathrooms = '2.5 bathrooms';
                }
            }

            filter_bathrooms = filterParameters.bathrooms;
            console.log('Filter by this many bathrooms: ' + filterParameters.bathrooms);
        } else {
            filter_bathrooms = /^/i;
            filter_shared_bathrooms = /^/i;
            filter_private_bathrooms = /^/i;
            filter_two_bathrooms =  /^/i;
            filter_two_half_bathrooms =  /^/i;
            filter_3_plus_bathrooms =  /^/i;
        }

        // Lease Terms
        if (filterParameters.leaseTerm && filterParameters.leaseTerm.toLowerCase() != 'all')
        {
            
            if (filterParameters.leaseTerm == 'One year')
                filterParameters.propertyType = 'Entire';
            else
                filterParameters.propertyType = 'Shared';  
        } 

        // Property 
        if (filterParameters.propertyType != 'ALL')
        {
            
            filter_propertyType = filterParameters.propertyType;
            console.log('Filter by this Property: ' + filterParameters.propertyType);
        } else {
            filter_propertyType = /^/i;
        }

        // Price 
        if (filterParameters.price != 'ALL')
        {
            
            filter_minPrice = Number(filterParameters.price.minPrice);
            filter_maxPrice = Number(filterParameters.price.maxPrice);
            console.log('Filter by this min Price: ' + filter_minPrice);
            console.log('Filter by this max Price: ' + filter_maxPrice);
        } else {
            filter_minPrice = 1;
            filter_maxPrice = 5000;
        }

        // Dates 
        if (filterParameters.availabilityDate != 'ALL')
        {
            var filter_date = new Date(filterParameters.availabilityDate);

            filter_date.setMonth(filter_date.getMonth() - 1);
        } else {
            var filter_date = new Date();
            filter_date.setMonth(filter_date.getMonth() - 1);
           
            
        }


        // Neighbourhoods
        if (filterParameters.selectedGeometry.length > 0)
        {

            var coordinatesArray  = new Array();
            
            var geoArrayCollection = new Array();
            for (var i = 0; i < filterParameters.selectedGeometry.length; i++)
            {
                var geometry  = filterParameters.selectedGeometry[i]['geometry'];
                //var geometry  = filterParameters.selectedGeometry;
                coordinatesArray = geometry.coordinates.toString().split(',');
                
                var geoSet = [];
                var geoArray = new Array();
                for (var c = 0; c < coordinatesArray.length; c+=2)
                {
                    geoSet = [ parseFloat(coordinatesArray[c+1]), parseFloat(coordinatesArray[c]) ];
                    geoArray.push(geoSet);
                }
                
                geoArrayCollection.push(geoArray);
            }

            var coordinates_1 = geoArrayCollection[0];

            if (!geoArrayCollection[1])
                geoArrayCollection[1] = geoArrayCollection[0];

            if (!geoArrayCollection[2])
                geoArrayCollection[2] = geoArrayCollection[0];

            if (!geoArrayCollection[3])
                geoArrayCollection[3] = geoArrayCollection[0];

            if (!geoArrayCollection[4])
                geoArrayCollection[4] = geoArrayCollection[0];

            if (!geoArrayCollection[5])
                geoArrayCollection[5] = geoArrayCollection[0];

            if (!geoArrayCollection[6])
                geoArrayCollection[6] = geoArrayCollection[0];

            if (!geoArrayCollection[7])
                geoArrayCollection[7] = geoArrayCollection[0];

            if (!geoArrayCollection[8])
                geoArrayCollection[8] = geoArrayCollection[0];

            if (!geoArrayCollection[9])
                geoArrayCollection[9] = geoArrayCollection[0];

            if (!geoArrayCollection[10])
                geoArrayCollection[10] = geoArrayCollection[0];

            if (!geoArrayCollection[11])
                geoArrayCollection[11] = geoArrayCollection[0];

            if (!geoArrayCollection[12])
                geoArrayCollection[12] = geoArrayCollection[0];

            if (!geoArrayCollection[13])
                geoArrayCollection[13] = geoArrayCollection[0];

            if (!geoArrayCollection[14])
                geoArrayCollection[14] = geoArrayCollection[0];

            if (!geoArrayCollection[15])
                geoArrayCollection[15] = geoArrayCollection[0];

           
            filterParameters.minPrice = filter_minPrice;
            filterParameters.maxPrice = filter_maxPrice;
            filterParameters.bedrooms = filter_bedrooms;
            filterParameters.date = filter_date;
            filterParameters.propertyType = filter_propertyType;
            //console.log('coordinates_2 : ' + coordinates_2 );
            //db.open(function(err,db){ 
             

             GatheredListings.collection.find({
                $and: [ 
                    { 'rentAmount': { $gte: filterParameters.minPrice } }, 
                    { 'rentAmount': { $lte: filterParameters.maxPrice } }, 
                    { 'availabilityDate': { $gte: filter_date } },
                    { 'propertyType': filterParameters.propertyType },
                    { 'bedrooms': filter_bedrooms },
                    { 'bathrooms': filter_bathrooms },
                    { $or: [ {'published': true }, { 'published': { $exists: false } } ]},
                    { 'createdById': { $exists: true } }, 
                    { $or: [
                        { 'bathrooms': filter_bathrooms},
                        { 'bathrooms': filter_two_bathrooms},
                        { 'bathrooms': filter_two_half_bathrooms},
                        { 'bathrooms': filter_shared_bathrooms},
                        { 'bathrooms': filter_private_bathrooms},
                        { 'bathrooms': filter_3_plus_bathrooms}
                    ]},
                    { $or: [
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[0]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[1]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[2]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[3]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[4]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[5]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[6]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[7]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[8]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[9]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[10]    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[11]   
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[12]  
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[13]   
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[14]
                                    
                                ] 
                              }
                           }}
                        }
                        ] 
                    }
                ]
             }).sort({ 'rentAmount': 1}).limit(200).toArray(function(err, properties) {
                console.log(properties);
                    if (err || !properties)
                    {
                        console.log('err ' + err);
                        callback("No properties found", null);
                    }
                    else {
                        console.log('Number of properties retrieved: ' + properties.length);

                        // if (filterParameters.basementApartment === "Yes" || petsCondition != "No")
                        // {
                            
                        //     getFilteredProperties(properties, petsCondition, filterParameters.basementApartment).then(function(filteredProperties)
                        //     {
                        //         callback(null, filteredProperties);
                        //     }).catch(function(reason)
                        //     {
                        //         callback(null, null);
                        //     });
                        // } else {
                            callback(null, properties);
                        //}
                        
                    }
             });


        } else {
            console.log('first one');
            // console.log('Property Type: ' + filter_propertyType);
            // console.log('Bedrooms: ' + filter_bedrooms);
            // console.log('Location: ' + 'All');
            // console.log('Minimum Rent Amount: ' + filter_minPrice);
            // console.log('Maximum Rent Amount: ' + filter_maxPrice);
            // console.log('Available From: ' + filter_date);
            GatheredListings.find({ $and: [ 
                { 'rentAmount': { $gte: filter_minPrice } }, 
                { 'rentAmount': { $lte: filter_maxPrice } }, 
                { 'availabilityDate': { $gte: filter_date } },
                { $or: [ {'published': true }, { 'published': { $exists: false } } ]},
                { 'createdById': { $exists: true } },
                { $or: [
                    { 'bathrooms': filter_bathrooms},
                    { 'bathrooms': filter_two_bathrooms},
                    { 'bathrooms': filter_two_half_bathrooms},
                    { 'bathrooms': filter_shared_bathrooms},
                    { 'bathrooms': filter_private_bathrooms},
                    { 'bathrooms': filter_3_plus_bathrooms}
                ]},
                { 'basementApartment': {$all: [filter_basementApartment_YES, filter_basementApartment_NO]}}
            ]})        
            .sort( { 'rentAmount': 1, 'postId': -1  })
            .where('location').within({ center: [43.653226,-79.38318429], radius: 100, unique: true, spherical: true })
            .where('bedrooms', filter_bedrooms)
            .where('propertyType', filter_propertyType)
            .limit(200)
            .exec(
                function (err, properties) 
                { 
                    
                    if (err || !properties)
                    {
                        callback("No properties found", null);
                    }
                    else {
                        console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        // if (filterParameters.basementApartment === "Yes" || petsCondition != "No")
                        // {
                            
                        //     getFilteredProperties(properties, petsCondition, filterParameters.basementApartment).then(function(filteredProperties)
                        //     {
                        //         callback(null, filteredProperties);
                        //     }).catch(function(reason)
                        //     {
                        //         callback(null, null);
                        //     });
                        // } else {
                        //     callback(null, properties);
                        // }
                        callback(null, properties);
                    }
            });
        }
    },

    getPropertyListingsByFilter: function(filterParameters, email, callback)
    {
        var postDateMin = new Date();
        postDateMin.setDate(postDateMin.getDate()-15);
        console.log("Post Date Min: " + postDateMin);
        var petsCondition = "No";
        // Pets

        if (!filterParameters || !filterParameters.pets)
        {
            console.log('getPropertyListingsByFilter - !filterParameters || !filterParameters.pets');
            callback("No properties found", null);
        }

        // var petsAll = false,  
        //     catsOnly = false,
        //     dogsOnly = false,
        //     noPets = false;

        // if (filterParameters.pets.cats === true && filterParameters.pets.dogs === true)
        // {
        //     petsAll = 'Yes';   
        //     catsOnly = 'cats only';   
        //     dogsOnly = 'dogs only';   
        //     console.log('Both pets');

        // } else if (filterParameters.pets.cats === true)
        // {
        //     catsOnly = 'cats only';   
        //     console.log('Cats only');
        // } else if (filterParameters.pets.dogs === true)
        // {
        //     dogsOnly = 'dogs only';   
        //     console.log('Dogs only');
        // } else {
        //     noPets = 'No';
        // }

        // Bedrooms
        if (filterParameters.bedrooms != 'ALL')
        {
            
            if (filterParameters.bedrooms == '1')
                filterParameters.bedrooms = '1 bedroom';
            else
                filterParameters.bedrooms = filterParameters.bedrooms + ' bedrooms';

            filter_bedrooms = filterParameters.bedrooms;
            console.log('Filter by this many bedrooms: ' + filterParameters.bedrooms);
        } else {
            filter_bedrooms = /^/i;
        }

        // Bathrooms
        if (filterParameters.bathrooms != 'ALL')
        {
            
            if (filterParameters.bathrooms == '1') 
            {
                filterParameters.bathrooms = '1 bathroom';
                filter_shared_bathrooms = '1 shared bathroom';
                filter_two_bathrooms = '2 bathrooms';
                filter_two_half_bathrooms = '2.5 bathrooms';
                filter_3_plus_bathrooms = '3+ bathrooms';
                filter_private_bathrooms = '1 private bathroom';
            }
            else{

                filterParameters.bathrooms = filterParameters.bathrooms + ' bathrooms';
                filter_shared_bathrooms = filterParameters.bathrooms;
                filter_private_bathrooms = filterParameters.bathrooms;
                filter_two_bathrooms = filterParameters.bathrooms;
                filter_two_half_bathrooms = filterParameters.bathrooms;
                filter_3_plus_bathrooms = filterParameters.bathrooms;

                if (filterParameters.bathrooms === '2 bathrooms')
                {
                    filter_two_half_bathrooms = '2.5 bathrooms';
                }
            }

            filter_bathrooms = filterParameters.bathrooms;
            console.log('Filter by this many bathrooms: ' + filterParameters.bathrooms);
        } else {
            filter_bathrooms = /^/i;
            filter_shared_bathrooms = /^/i;
            filter_private_bathrooms = /^/i;
            filter_two_bathrooms =  /^/i;
            filter_two_half_bathrooms =  /^/i;
            filter_3_plus_bathrooms =  /^/i;
        }

        // Lease Terms
        if (filterParameters.leaseTerm && filterParameters.leaseTerm.toLowerCase() != 'all')
        {
            
            if (filterParameters.leaseTerm == 'One year')
                filterParameters.propertyType = 'Entire';
            else
                filterParameters.propertyType = 'Shared';  
        } 

        // Property 
        if (filterParameters.propertyType != 'ALL')
        {
            
            filter_propertyType = filterParameters.propertyType;
            console.log('Filter by this Property: ' + filterParameters.propertyType);
        } else {
            filter_propertyType = /^/i;
        }

        // Price 
        if (filterParameters.price != 'ALL')
        {
            
            filter_minPrice = Number(filterParameters.price.minPrice);
            filter_maxPrice = Number(filterParameters.price.maxPrice);
            console.log('Filter by this min Price: ' + filter_minPrice);
            console.log('Filter by this max Price: ' + filter_maxPrice);
        } else {
            filter_minPrice = 1;
            filter_maxPrice = 5000;
        }
        
        console.log(filterParameters.availabilityDate);

        // // Dates 
        if (filterParameters.availabilityDate != 'ALL')
        {
            // var filter_date = new Date(filterParameters.availabilityDate);
            filter_date = filterParameters.availabilityDate;
            // filter_date.setMonth(filter_date.getMonth() - 1);

        } else {
            var filter_date = new Date();
            filter_date.setMonth(filter_date.getMonth() - 1);
           
            
        }

        var oneYear = false;
        var monthly = false;
        var sublet = false;


        if(filterParameters.lease.oneYear){
            oneYear = "One year"
        } 
        if(filterParameters.lease.monthly){
            monthly = "Monthly"
        } 
        if(filterParameters.lease.sublet){
            sublet = "Sublet"
        } 

        console.log( filterParameters.availabilityDate);
        // Neighbourhoods
        if (filterParameters.selectedGeometry.length > 0)
        {

            var coordinatesArray  = new Array();
            
            var geoArrayCollection = new Array();
            for (var i = 0; i < filterParameters.selectedGeometry.length; i++)
            {
                var geometry  = filterParameters.selectedGeometry[i]['geometry'];
                //var geometry  = filterParameters.selectedGeometry;
                coordinatesArray = geometry.coordinates.toString().split(',');
                
                var geoSet = [];
                var geoArray = new Array();
                for (var c = 0; c < coordinatesArray.length; c+=2)
                {
                    geoSet = [ parseFloat(coordinatesArray[c+1]), parseFloat(coordinatesArray[c]) ];
                    geoArray.push(geoSet);
                }
                
                geoArrayCollection.push(geoArray);
            }

            var coordinates_1 = geoArrayCollection[0];

            if (!geoArrayCollection[1])
                geoArrayCollection[1] = geoArrayCollection[0];

            if (!geoArrayCollection[2])
                geoArrayCollection[2] = geoArrayCollection[0];

            if (!geoArrayCollection[3])
                geoArrayCollection[3] = geoArrayCollection[0];

            if (!geoArrayCollection[4])
                geoArrayCollection[4] = geoArrayCollection[0];

            if (!geoArrayCollection[5])
                geoArrayCollection[5] = geoArrayCollection[0];

            if (!geoArrayCollection[6])
                geoArrayCollection[6] = geoArrayCollection[0];

            if (!geoArrayCollection[7])
                geoArrayCollection[7] = geoArrayCollection[0];

            if (!geoArrayCollection[8])
                geoArrayCollection[8] = geoArrayCollection[0];

            if (!geoArrayCollection[9])
                geoArrayCollection[9] = geoArrayCollection[0];

            if (!geoArrayCollection[10])
                geoArrayCollection[10] = geoArrayCollection[0];

            if (!geoArrayCollection[11])
                geoArrayCollection[11] = geoArrayCollection[0];

            if (!geoArrayCollection[12])
                geoArrayCollection[12] = geoArrayCollection[0];

            if (!geoArrayCollection[13])
                geoArrayCollection[13] = geoArrayCollection[0];

            if (!geoArrayCollection[14])
                geoArrayCollection[14] = geoArrayCollection[0];

            if (!geoArrayCollection[15])
                geoArrayCollection[15] = geoArrayCollection[0];

           
            filterParameters.minPrice = filter_minPrice;
            filterParameters.maxPrice = filter_maxPrice;
            filterParameters.bedrooms = filter_bedrooms;
            filterParameters.date = filter_date;
            filterParameters.propertyType = filter_propertyType;
            //console.log('coordinates_2 : ' + coordinates_2 );
            //db.open(function(err,db){ 
            
            console.log(filter_date);


 
            GatheredListings.find({ $and: [ 
                { 'rentAmount': { $gte: filter_minPrice } }, 
                { 'rentAmount': { $lte: filter_maxPrice } },
                { 'availabilityDate': { $gte: filter_date } },
                { 'addedImages' : {$exists: true, $not: {$size: 0}}},
                { $or: [
                    { 'bathrooms': filter_bathrooms},
                    { 'bathrooms': filter_two_bathrooms},
                    { 'bathrooms': filter_two_half_bathrooms},
                    { 'bathrooms': filter_shared_bathrooms},
                    { 'bathrooms': filter_private_bathrooms},
                    { 'bathrooms': filter_3_plus_bathrooms}
                ]},
                { $or: [
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[0]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[1]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[2]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[3]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[4]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[5]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[6]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[7]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[8]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[9]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[10]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[11]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[12]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[13]
                                    
                                ] 
                              }
                           }}
                        },
                        { 'location': {
                           $geoWithin: {
                              $geometry: {
                                 type : "Polygon" ,
                                 coordinates: [ 
                                    geoArrayCollection[14]
                                    
                                ] 
                              }
                           }}
                        }
                        ] 
                    }
            ]})        
            .sort( { 'rentAmount': 1})
            .where('bedrooms', filter_bedrooms)
            .where({ $or: [
                {'basementApartment': filterParameters.basementApartment},
                {'basementApartment': "No"} 
                ]})
            .where('propertyType', filter_propertyType)
            // .limit(200)
            .lean()
            .exec(
                function (err, properties) 
                { 
                    
                    if (err || !properties)
                    {
                        callback("No properties found", null);
                    }
                    else {
                        // var test = properties.toObject();
                        // callback(null, properties);
                        matchmakingProperties(properties, email).then(function(propertiesMatched) {
                            console.log("Matched Properites");
                            callback(null, propertiesMatched);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        }, function(err) {
                            console.log(err);
                            callback(null, properties);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        });

                    }
            });

        } else {
            console.log('first one');
            // console.log('Property Type: ' + filter_propertyType);
            // console.log('Bedrooms: ' + filter_bedrooms);
            // console.log('Location: ' + 'All');
            // console.log('Minimum Rent Amount: ' + filter_minPrice);
            // console.log('Maximum Rent Amount: ' + filter_maxPrice);
            // console.log('Available From: ' + filter_date);
            // { 'basementApartment': filterParameters.basementApartment },
            // 
            // console.log(filterParameters.basementApartment);
            GatheredListings.find({ $and: [ 
                { 'rentAmount': { $gte: filter_minPrice } }, 
                { 'rentAmount': { $lte: filter_maxPrice } },
                { 'availabilityDate': { $gte: filter_date } },
                { 'addedImages' : {$exists: true, $not: {$size: 0}}},
                { $or: [
                    { 'leaseTermsAvailable.0.name': monthly },
                    { 'leaseTermsAvailable.0.name': oneYear },
                    { 'leaseTermsAvailable.0.name': sublet }
                    ]},
                // { $or: [
                //     { 'petsWelcome.0.name': petsAll},
                //     { 'petsWelcome.0.name': dogsOnly},
                //     { 'petsWelcome.0.name': catsOnly},
                //     { 'petsWelcome.0.name': noPets},
                // ]},
                { $or: [
                    { 'bathrooms': filter_bathrooms},
                    { 'bathrooms': filter_two_bathrooms},
                    { 'bathrooms': filter_two_half_bathrooms},
                    { 'bathrooms': filter_shared_bathrooms},
                    { 'bathrooms': filter_private_bathrooms},
                    { 'bathrooms': filter_3_plus_bathrooms}
                    ]}]})
                    
            .sort( { 'rentAmount': 1})
            .where('location').within({ center: [43.653226,-79.38318429], radius: 100, unique: true, spherical: true })
            .where('bedrooms', filter_bedrooms)
            .where({ $or: [
                {'basementApartment': filterParameters.basementApartment},
                {'basementApartment': "No"} 
                ]})
            .where('propertyType', filter_propertyType)
            // .limit(200)
            .lean()
            .exec(
                function (err, properties) 
                { 
                    
                    if (err || !properties)
                    {
                        callback("No properties found", null);
                    }
                    else {
                        // var test = properties.toObject();
                        // callback(null, properties);
                        matchmakingProperties(properties, email).then(function(propertiesMatched) {
                            console.log("Matched Properites");
                            callback(null, propertiesMatched);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        }, function(err) {
                            console.log(err);
                            callback(null, properties);
                            console.log('Number of properties retrieved (no Neighbourhoods): ' + properties.length);
                        });

                    }
            });
        }

        

       
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