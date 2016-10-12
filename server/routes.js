var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , PropertyCtrl =  require('./controllers/propertyListing')
    , SearchProfileCtrl = require('./controllers/searchProfiles')
    , QuestionsCtrl = require('./controllers/questionsListings')
    , User =      require('./models/User.js')
    , ApartmateUser =      require('./models/ApartmateUser.js')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

var firstName = '';
var emailAddress = '';

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',

        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.header("Access-Control-Allow-Origin", "*");
            res.render(requestedView);
        }]
    },

    // OAUTH
    {
        path: '/auth/twitter',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter')]
    },
    {
        path: '/auth/twitter/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        })]
    },
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {scope: 'email'})]
    },
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            console.log('req: ' + req.url);
            AuthCtrl.loginWithFacebook(req, res, function(res, err)
            {   
                console.log(res);
                console.log('done!');
                //res.render('search');
            });
        }]

    },
    {
        path: '/auth/google',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google')]
    },
    {
        path: '/auth/google/return',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/'
        })]
    },
    {
        path: '/auth/linkedin',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin', {
            successRedirect: '/edit_roommate',
            failureRedirect: '/edit_roommate'
        })]
    },
    {
        path: '/auth/linkedin/callback',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            console.log('/auth/linkedin/callback - req.url: ' + req.url);
            AuthCtrl.loginWithLinkedIn(req, res, function(err, res)
            {
                console.log('done!');
                //res.render('search');
            });
        }]
    },

    // Local Auth
    {
        path: '/signup',
        httpMethod: 'POST',
        middleware: [AuthCtrl.signup]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/verify',
        httpMethod: 'POST',
        middleware: [AuthCtrl.verify]
    },
    {
        path: '/forgotPassword',
        httpMethod: 'POST',
        middleware: [AuthCtrl.forgotPassword]
    },
    {
        path: '/resetPassword',
        httpMethod: 'POST',
        middleware: [AuthCtrl.resetPassword]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },  

    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.admin
    },

    
    {
        path: '/updateApartmatePictures',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.updateApartmatePictures]
    },

    // Get User's Property Listings 
    {
        path: '/getPropertyListingsByUser',
        httpMethod: 'POST',
        middleware: [AuthCtrl.getPropertyListingsByUser]
    },

    {
        path: '/getPropertyListingById',
        httpMethod: 'POST',
        middleware: [AuthCtrl.getPropertyListingById]
    },

    {
        path: '/getPropertyById',
        httpMethod: 'POST',
        middleware: [AuthCtrl.getPropertyById]
    },

    // Add Listing to Favorites
    {
        path: '/addToFavorites',
        httpMethod: 'POST',
        middleware: [AuthCtrl.addToFavorites]
    },

    // Remove Listing from Favorites
    {
        path: '/removeFromFavorites',
        httpMethod: 'POST',
        middleware: [AuthCtrl.removeFromFavorites]
    },



    // Get Favorite Listings 
    {
        path: '/getFavoriteProperties',
        httpMethod: 'POST',
        middleware: [AuthCtrl.getFavoriteProperties]
    },

    // Add Listing
    {
        path: '/addPropertyListing',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.addPropertyListing]
    },

    // // Add Listing Picture
    // {
    //     path: '/properties/upload',
    //     httpMethod: 'POST',
    //     middleware: [PropertyCtrl.uploadPropertyPicture]
    // },

    
    {
        path: '/getLastKnownProperty',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.getLastKnownProperty]
    },

    // Add Listing Description
    {
        path: '/updatePropertyPart2ById',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updatePropertyPart2ById]
    },

    // Finish Whole Property Listing
    {
        path: '/updateAndFinishPropertyById',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updateAndFinishPropertyById]
    },

    // Edit Listing
    {
        path: '/editPropertyListing',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.editPropertyListing]
    },

    {
        path: '/updatePropertyPictures',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updatePropertyPictures]
    },


    {
        path: '/editSharedPropertyListing',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.editSharedPropertyListing]
    },

    
    

    // Shared Property Part1
    {
        path: '/addSharedPropertyListing',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.addSharedPropertyListing]
    },

    // Shared Property Part2
    {
        path: '/updateSharedPropertyPart2ById',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updateSharedPropertyPart2ById]
    },

    // Shared Property Part3
    {
        path: '/updateAndFinishSharedPropertyById',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updateAndFinishSharedPropertyById]
    },

    {
        path: '/addApartmateProfilePart1',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.addApartmateProfilePart1]
    },

    {
        path: '/updateApartmateProfilePart1',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.updateApartmateProfilePart1]
    },

    {
        path: '/updateActiveProfile',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.updateActiveProfile]
    },
    
    {
        path: '/updateAndFinishApartmateProfileById',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.updateAndFinishApartmateProfileById]
    },


    {
        path: '/addSharedSearchProfilePart1',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.addSharedSearchProfilePart1]
    },

    {
        path: '/updateAndFinishSharedSearchProfileById',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.updateAndFinishSharedSearchProfileById]
    },

    {
        path: '/getPropertyListings',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.getPropertyListings]
    },

    {
        path: '/getPropertyListingsByFilter',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.getPropertyListingsByFilter]
    },

    {
        path: '/getPropertyListingsByFilterApartmate',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.getPropertyListingsByFilterApartmate]
    },

    {
        path: '/deletePropertyListingById/:id',
        httpMethod: 'DELETE',
        middleware: [PropertyCtrl.deletePropertyListingById]
    },

    {
        path: '/updatePublishedPropertyListing/:id',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updatePublishedPropertyListing]
    },

    {
        path: '/getApartmateProfile',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.getApartmateProfile]
    },
    
    {
        path: '/getApartmateListing',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.getApartmateListing]
    },

    {
        path: '/getApartmateListings',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.getApartmateListings]
    },

    {
        path: '/getApartmateListingsByFilter',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.getApartmateListingsByFilter]
    },

    {
        path: '/getQuestions',
        httpMethod: 'POST',
        middleware: [QuestionsCtrl.getQuestionsListings]
    },
    {
        path: '/addQuestionById',
        httpMethod: 'POST',
        middleware: [QuestionsCtrl.addQuestionById]
    },
    {
        path: '/addCreatedQuestion',
        httpMethod: 'POST',
        middleware: [QuestionsCtrl.addCreatedQuestion]
    },
    {
        path: '/updateFBBoost',
        httpMethod: 'POST',
        middleware: [PropertyCtrl.updateFBBoost]
    },
    {
        path: '/dismissFBModal',
        httpMethod: 'POST',
        middleware: [SearchProfileCtrl.dismissFBModal]
    },


    // All other get requests should be handled by AngularJS's client-side routing system
    {

        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {

            var role = userRoles.public, username = '', apartmateListingCreated = false, _id ='';
            res.header("Access-Control-Allow-Origin", "*");
            if(req.user) {
                console.log('/* - GET - req.user exists');
                console.log("HEEEEEEEREEEEEE!!!!!!")
                console.log(req.user);
                role = req.user.role;


                if(req.user.addedProfileImages.length > 0)
                    src = req.user.addedProfileImages[0].url;
                else 
                    src ='';
            

                console.log("req.user.firstName : " + req.user.firstName);

                username = req.user.username;           
                firstName = req.user.firstName;
                fbModalInit = req.user.fbModalInit;
                _id = req.user._id;
                emailAddress = req.user.emailAddress;
                console.log('req.user.apartmateListingCreated: ' + req.user.apartmateListingCreated);
                apartmateListingCreated = req.user.apartmateListingCreated;
                profileCreated = req.user.profileCreated;
                questionsResults = req.user.questionsResults;
                questionsAnswered = req.user.questionsAnswered;

                res.cookie('user', JSON.stringify({
                    'emailAddress': emailAddress,
                    'username': username,
                    'role': role,
                    'src': src,
                    '_id': _id,
                    'fbModalInit': fbModalInit,
                    'apartmateListingCreated': apartmateListingCreated,
                    'profileCreated': profileCreated,
                    'firstName': firstName,
                    'questionsAnswered': questionsAnswered,
                    'questionsResults': questionsResults
                }));
            } else {
                 console.log('/* - GET - !req.user');
                 res.cookie('user', '');
                // console.log("req: " + req);
                // console.log("res: " + res);
            }
            console.log('Username: ' + username + ' with role: ' + role.title + ' and role: ' + role.bitMask);
            
            // console.log('Cookie being set: ' + JSON.stringify({
            //     'emailAddress': emailAddress,
            //     'username': username,
            //     'role': role,
            //     '_id': _id,
            //     'apartmateListingCreated': apartmateListingCreated,
            //     'firstName': firstName
            // })); 

            // Cookie being set: {"emailAddress":"a@abc.om","username":"",
            // "role":{"bitMask":1,"title":"public"},"_id":"","apartmateListingCreated":false,"firstName":"Adam"}

            
            res.render('index');
        }]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.stack[0].method.toUpperCase() }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}
