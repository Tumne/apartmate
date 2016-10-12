var ApartmateUser =      require('./ApartmateUser.js');

var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles;

var nodemailer =  require('nodemailer');
var randtoken = require('rand-token');

var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");
var crypto =  require('crypto');
var RSVP = require('rsvp');


var mongoose = require('mongoose');

var users = [
    {
        id:         1,
        username:   "user",
        emailAddress: "userTest@apartmate.com",
        password:   "123",
        role:   userRoles.user
    },
    {
        id:         2,
        username:   "admin",
        emailAddress: "adminTest@apartmate.com",
        password:   "123",
        role:   userRoles.admin
    }
];

function sendWelcomeEmailToUser(_email)
{

    var smtpTransport = nodemailer.createTransport('SMTP', 
    {
        service: 'SendGrid',
        auth: {
            user: 'apartmate-test',
            pass: 'Lovelife1!'

        }
    });
    var mailOptions = {
        to: _email,
        bcc: 'info@apartmate.ca',
        from: 'info@apartmate.ca',
        subject: 'Thank you for signing up with Apartmate!',
        text: 'Welcome to Apartmate!\n\n\n Thank you for joining our growing community of Toronto roommates, renters, and landlords. \n\n\n We’re working hard to bring you the best rental resource in the city. \n If you have any questions, feedback or would just like to say hello, \n we would love to hear from you at info@apartmate.ca.\n\n\n Thank you for using Apartmate! \n\n\n View my Listing here: \n http://www.apartmate.ca/\n\n\n Check us out on Facebook: \n https://www.facebook.com/ApartmateCanada\n\n\n Tweet us on twitter: \n https://twitter.com/apartmatecanada',
        html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css">.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"><table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" ><tr><td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a></td></tr><tr> <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>Welcome to Apartmate!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 0 5px;"> Thank you for joining our growing community of Toronto roommates, renters, and landlords. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 35px 5px;">We’re working hard to bring you the best rental resource in the city. If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <a href="http://www.apartmate.ca/" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">Get Started</button> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a></td></tr></table> </body></html>'
    }; 
    smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Email was sent');
        //return res.send(403, 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.'); 
        //req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');

    });

}



console.log('users: ' + JSON.stringify(users));

module.exports = {
    addUser: function(emailAddress, password, role, emailRecieve, callback) {


        this.findByEmail(emailAddress).then(function(user)
        {

            console.log('addUser: ' + user);
            if (user !== '')
                callback("UserAlreadyExists", null);
            else {
                console.log('Creating user...');

                // Clean up local cache when 500 users reached
                if(users.length > 500) 
                    users = users.slice(0, 2);

                // Create Apartmate User
                var newUser = ApartmateUser();
                newUser.emailAddress = emailAddress;
                newUser.username = emailAddress;
                newUser.firstName = '';
                newUser.password = password;
                newUser.role = role;
                newUser.verifiedToken = randtoken.generate(16);
                newUser.emailRecieve = emailRecieve;

                console.log(randtoken.generate(16));
                console.log('emailAddress: ' + newUser.emailAddress);
                console.log('username: ' + newUser.username);
                console.log('username: ' + newUser.firstName);
                console.log('password: ' + newUser.password);
                console.log('role: ' + newUser.role);

                // Save new Apartmate user
                newUser.save(function(err, newUserCreated)
                {
                    if (err)
                    {
                        console.log('Error with registration: ' + err);
                        callback('Registration failed', null);
                    } else 
                    {
                        console.log('New Apartmate User was created');

                        //users.push(newUserCreated);


                        callback(null, newUserCreated);
                    }
                });

            }
        }).catch(function(reason)
        {
            console.log('Reason Line 50: ' + reason);
        });
    },
    verifyUser:function(emailAddress, token, callback){
        console.log(emailAddress);
        console.log(token);
        console.log("verifyUser");

        ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser)
        {
            console.log(existingUser);
            console.log(err);

            if (err || !existingUser)
            { 
               callback(err, null);
            }
            else {

                if(token == existingUser.verifiedToken){

                    existingUser.verifiedUser = true;
                    existingUser.verifiedToken = null;
                    existingUser.save(function(err, existingUserUpdated) 
                    {
                        if (err)
                        {
                            console.log('Error with verification: ' + err);
                            callback('verification failed', null);
                        } else 
                        {
                            console.log('Apartmate User was verified through Oauth');

                            existingUserUpdated.username = existingUserUpdated.emailAddress;
                            callback(null, existingUserUpdated);
                        }
                    });


                } else {
                    callback("No Token or Token did not match", null);
                }

            }
        });
        
    },
    addFacebookUser:function(emailAddress, facebookData, callback){
        
    },
    addLinkedInUser: function(emailAddress, linkedInData, callback) 
    {
        console.log('findOrVerifyOauthUser');

        ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser) 
        { 
            
           
            if(!existingUser || err) 
            {
               
                console.log('unable to verify account');
            } else {
                console.log('verified emailAddress: ' + existingUser.emailAddress);
                var providerObj = {
                        name: 'linkedin',
                        id: linkedInData.profile.id,
                        credentials: linkedInData
                    };

                existingUser.provider.push(providerObj);
                
                existingUser.save(function(err, existingUserUpdated) 
                {
                    if (err)
                    {
                        console.log('Error with verification: ' + err);
                        callback('verification failed', null);
                    } else 
                    {
                        console.log('Apartmate User was verified through Oauth');

                        existingUserUpdated.username = existingUserUpdated.emailAddress;
                        callback(null, existingUserUpdated);
                    }
                });
                
            }
        });
    },

    findOrVerifyOauthUser: function(provider, providerId, providerCredentialData, emailAddress, callback) 
    {
        console.log('findOrVerifyOauthUser');

        ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser) 
        { 
            
           
            if(!existingUser || err) 
            {
               
                console.log('unable to verify account');
            } else {
                console.log('verified emailAddress: ' + existingUser.emailAddress);
                var providerObj = {
                        name: provider,
                        id: providerId,
                        credentials: providerCredentialData
                    };

                existingUser.provider.push(providerObj);
                
                existingUser.save(function(err, existingUserUpdated) 
                {
                    if (err)
                    {
                        console.log('Error with verification: ' + err);
                        callback('verification failed', null);
                    } else 
                    {
                        console.log('Apartmate User was verified through Oauth');

                        existingUserUpdated.username = existingUserUpdated.emailAddress;
                        callback(null, existingUserUpdated);
                    }
                });
                
            }
        });
        
    },

    findOrCreateOauthUser: function(provider, providerId, providerCredentialData, emailAddress, callback) 
    {
        console.log('findOrCreateOauthUser');

        ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, existingUser) 
        { 
            
           
            if(!existingUser || err) 
            {
               
                var newUser = ApartmateUser();
                newUser.username = 'user_' + providerId;
                newUser.emailAddress = emailAddress;
                newUser.role = userRoles.user;

                var providerObj = {
                    name: provider,
                    id: providerId,
                    credentials: providerCredentialData
                };


                console.log('emailAddress: ' + newUser.emailAddress);
                console.log('username: ' + newUser.username);
                console.log('password: ' + newUser.password);
                console.log('role: ' + newUser.role);

                newUser.provider.push(providerObj);
                newUser.username = newUser.emailAddress;
                    
                console.log('Attemping to createApartmateUser');
                newUser.save(function(err, newUserCreated) 
                {
                    if (err)
                    {
                        console.log('Error with registration: ' + err);
                        callback('Registration failed', null);
                    } else 
                    {
                        console.log('New Apartmate User was created through Oauth');
                        sendWelcomeEmailToUser(newUserCreated.emailAddress);
                        //users.push(newUserCreated);
                        newUserCreated.username = newUserCreated.emailAddress;
                        callback(null, newUserCreated);
                    }
                });
            } else {
                console.log('user exists: ' + existingUser.emailAddress);

                console.log('emailAddress: ' + existingUser.emailAddress);
                console.log('username: ' + existingUser.username);
                console.log('password: ' + existingUser.password);
                console.log('role: ' + existingUser.role);
                //users.push(existingUser);
                
                callback(null, existingUser);
            }
        });
        
    },

    findAll: function() {
        return _.map(users, function(user) { return _.clone(user); });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        ApartmateUser.findOne({ 'username': username}, function (err, user) 
        { 
            
            if (err || !user)
            {
                return err;
            }
            else {
                console.log('username exists: ' + user.emailAddress);
                console.log('returning true');
                return user;
            }
        });

        //return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByEmail: function(emailAddress) {
        var promise = new RSVP.Promise(function(resolve, reject)
        {
            ApartmateUser.findOne({ 'emailAddress': emailAddress}, function (err, user) 
            { 
                
                if (err || !user)
                {
                    resolve("");
                }
                else {
                    console.log('user email address exists: ' + user.emailAddress);
                    resolve(user.emailAddress);
                }
            });
        });

        return promise;
    },


    findApartmateUserById: function(id, callback) {

        ApartmateUser.findOne({ '_id': id}, function (err, user) 
        { 
            console.log(user);

            if (err || !user)
            {
                callback(err, null);
            }
            else {
                // console.log('apartmate exists at this firstName: ' + );
                callback(null, user);
            }

        });


        //return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.emailAddress, 'You will need a valid email address to continue').isEmail();
        check(user.password, 'Your password must be at least 5 characters. Thank you!').len(5, 60);
        //check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(emailAddress, password, done) {
            console.log('emailAddress 1: ' + emailAddress);

            ApartmateUser.findOne({ 'emailAddress': emailAddress }, function(err, user) 
            {
                if (err) 
                { 
                    console.log('err line 206: ' + err);
                    return done(err); 
                }
                if (!user) 
                {
                    console.log('err line 211: ' + err);
                    return done(null, false, { message: "Sorry, we don't recognize that email address. Please try again or create an account."  });  
                }
                

                var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
                var key = 'a1rb0rn3';
                var decipher = crypto.createDecipher(algorithm, key);
                decrypted = decipher.update(user.password, 'hex', 'utf8') + decipher.final('utf8');

                if (decrypted === password)
                {
                    console.log('password matched');
                    return done(null, user, {});
                } else 
                {
                    return done(null, false, { message: "Sorry, that password isn't quite right. We can help you recover your password. " });
                }
                // bcrypt.compare(password, user.hash, function()
                // {
                //     if(err) 
                //     { 
                //         console.log('err line 219: ' + err);
                //         return done(null, false, { message: 'Incorrect password.' }); 
                //     } else 
                //     { 
                //         console.log('password matched');
                //         return done(null, user);
                //     }
                // });
            });
        }
    ),

    twitterStrategy: function() {
        if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
        if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

        return new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            var twitterCredentialData = {
                token: token,
                tokenSecret: tokenSecret,
                profile: profile
            };
            //var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id, twitterCredentialData);
            module.exports.findOrCreateOauthUser(profile.provider, profile.id, twitterCredentialData, function(err, user)
            {

                if (!err && user)
                {
                    console.log('user at twitterStrategy: ' + JSON.stringify(user));
                    done(null, user);
                } else {
                    console.log('err: ' + err);
                     console.log('user: ' + user);   
                     done(err, null);
                }
            });  
        });
    },

    facebookStrategy: function() {
        if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

        return new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:5000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('FB email: ' + profile.emails[0]['value']);
            console.log('FB login successful: ' + JSON.stringify(profile));

            var facebookCredentialData = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                profile: profile,
                emailAddress: profile.emails[0]['value']
            };

            module.exports.findOrCreateOauthUser(profile.provider, profile.id, facebookCredentialData, facebookCredentialData.emailAddress, function(err, user)
            {

                if (!err && user)
                {
                    console.log('user at facebookStrategy: ' + JSON.stringify(user));
                    done(null, user);
                } else {
                    console.log('err: ' + err);
                    console.log('user: ' + user);  
                    done(err, err); 
                }
            });            
        });
    },

    googleStrategy: function() {

        return new GoogleStrategy({
            returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
            realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
        },
        function(identifier, profile, done) {
            var user = module.exports.findOrCreateOauthUser('google', identifier);
            done(null, user);
        });
    },

    linkedInStrategy: function() {
        if(!process.env.LINKED_IN_KEY)
            process.env.LINKED_IN_KEY = '75r6yc9xpvtoam';

                 //throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
        if(!process.env.LINKED_IN_SECRET) //throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');
            process.env.LINKED_IN_SECRET = 'bC9jjl6emad6TyqJ';
        
        return new LinkedInStrategy({
            clientID: process.env.LINKED_IN_KEY,
            clientSecret: process.env.LINKED_IN_SECRET,
            callbackURL: process.env.LINKED_IN_CALLBACK_URL ||  "http://www.apartmate.com/auth/linkedin/callback", //"http://localhost:5000/auth/linkedin/callback", "http://www.apartmate.com/auth/linkedin/callback",  //,
            scope: [ 'r_basicprofile', 'r_emailaddress'],
            state: true
          },
          function(token, tokenSecret, profile, done) {
            console.log('LinkedIn email: ' + profile.emails[0]['value']);
            //console.log('LinkedIn login successful: ' + JSON.stringify(profile));

            done(null, {'accessToken': token, 'refreshToken': tokenSecret, 'profile': profile});
            

            
            module.exports.findOrVerifyOauthUser(profile.provider, profile.id, linkedInCredentialData, profile.emails[0]['value'], function(err, user)
            {

                if (!err && user)
                {
                    console.log('LinkedIn Verification Complete');
                    done(null, user);
                } else {
                    console.log('err: ' + err);
                    console.log('user: ' + user);  
                    done(err, err); 
                }
            });            
        });
    },
    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {

        //console.log('deserializeUser id: ' + id)
        ApartmateUser.findById(id, function (err, user) 
        { 
            if (user) 
            { 
                console.log('found user');
                done(null, user); 
            } else 
            { 
                console.log('not finding user');
                done(null, false); 
            }
        });


        // var user = module.exports.findById(id);

        // if(user)    { done(null, user); }
        // else        { done(null, false); }
    }
};