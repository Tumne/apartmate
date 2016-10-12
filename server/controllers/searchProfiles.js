var passport =  require('passport');
var ApartmateListing = require('../models/ApartmateListing.js');
var User = require('../models/User.js');
var nodemailer =  require('nodemailer');
var async =  require('async');

var flow = require('../../flow-node.js')('tmp');

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

module.exports = {
    addApartmateProfilePart1: function(req, res, next) 
    { 
        ApartmateListing.updateApartmateListing(req.body.apartmate, function(err, apartmateListing) 
        {
            console.log('createApartmateProfile');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was added with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 
            }

        });

    },

    updateApartmateProfilePart1: function(req, res, next) 
    { 
        ApartmateListing.updateApartmateListing(req.body.apartmate, function(err, apartmateListing) 
        {
            

            console.log('createApartmateProfile');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was updated with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 
            }

        });

    },
    
    updateAndFinishApartmateProfileById: function(req, res, next) 
    {
       console.log('user id: ' + req.body.apartmate._id);
        
        ApartmateListing.updateAndFinish(req.body.apartmate, function(err, apartmateListing) 
        {
            console.log('updateNameEtAll');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was updated with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 
            }

        });

    },

    addSharedSearchProfilePart1: function(req, res, next) 
    { 
        console.log('req body: ' + req.body);
        ApartmateListing.updateApartmateListingWithSharedSearch(req.body.apartmate, function(err, apartmateListing) 
        {
            

            console.log('createApartmateProfile');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was added with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 
            }

        });

    },

    updateAndFinishSharedSearchProfileById: function(req, res, next) 
    {
       console.log('user id: ' + req.body.apartmate._id);
        
        ApartmateListing.updateAndFinishWithSharedSearch(req.body.apartmate, function(err, apartmateListing) 
        {
            console.log('updateNameEtAll');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was updated with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 
            }

        });

    },

    getApartmateProfile: function(req, res, next)
    {
        console.log('getApartmateListing: ' + req.body._id);

        User.findApartmateUserById(req.body._id, function(err, user)
        {
            if (err || !user)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmate listing detail');
                res.json(200, { "user": user });
            }
        });

    },

    getApartmateListing: function(req, res, next)
    {
        console.log('getApartmateListing: ' + req.body.emailAddress);

        ApartmateListing.getApartmateListing(req.body.emailAddress, function(err, apartmate)
        {
            if (err || !apartmate)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmate listing detail');
                res.json(200, { "apartmate": apartmate });
            }
        });

    },

    updateActiveProfile: function(req, res, next)
    {
        console.log('getApartmateListing: ' + req.body);
        console.log(req.body);
        // res.json(200, { "apartmate": "test" });

        ApartmateListing.updateActiveProfile(req.body.email, function(err, apartmate)
        {
            if (err || !apartmate)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmate listing detail');

                res.json(200, { "apartmate": apartmate });
            }
        });

    },
    updateApartmatePictures: function(req, res, next)
    {
        console.log('updateApartmatePictures: ');

        ApartmateListing.removeExistingPictures(req.body.apartmate, function(err, apartmateListing)
        {
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Apartmate Listing was updated with ID: " + apartmateListing.id);
                res.json(200, { "apartmate": apartmateListing }); 

            }
        });

    },


    getApartmateListings: function(req, res, next)
    {
        console.log('getApartmateListings');

        ApartmateListing.getApartmateListings(req.body.filterParameters, function(err, apartmates)
        {
            console.log('req.body.filterParameters: ');
            if (err || !apartmates)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmates');
                res.json(200, { "apartmates": apartmates });
            }
        });

    },

    getApartmateListingsByFilter: function(req, res, next)
    {
        console.log('getApartmateListingsByFilter under SearchProfile');

        ApartmateListing.getApartmateListingsByFilter(req.body.filterParameters, req.body.email, function(err, apartmates)
        {
            if (err || !apartmates)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmates');
                res.json(200, { "apartmates": apartmates });
            }
        });

    },

    dismissFBModal: function(req, res, next)
    {
        console.log('getApartmateListingsByFilter under SearchProfile');

        ApartmateListing.dismissFBModal(req.body.email, function(err, apartmate)
        {
            if (err || !apartmate)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve apartmates');
                res.json(200, { "apartmate": apartmate });
            }
        });

    }
};