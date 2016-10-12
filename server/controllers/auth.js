var passport =  require('passport')
    , User = require('../models/User.js');
var ApartmateUser = require('../models/ApartmateUser.js');
var PropertyListing = require('../models/PropertyListing.js');

var nodemailer =  require('nodemailer');
var async =  require('async');
var crypto =  require('crypto');

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

function sendVerifyAccountToUser(_email, _token, _url)
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
        subject: 'Please verify and activate your Apartmate account!',
        text: 'You\'re almost there!\n\n\n Just one more step to get you started \n\n\n We’re working hard to bring you the best rental resource in the city. \n If you have any questions, feedback or would just like to say hello, \n we would love to hear from you at info@apartmate.ca.\n\n\n Thank you for using Apartmate! \n\n\n View my Listing here: \n http://www.apartmate.ca/\n\n\n Check us out on Facebook: \n https://www.facebook.com/ApartmateCanada\n\n\n Tweet us on twitter: \n https://twitter.com/apartmatecanada',
        // html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css">.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"><table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" ><tr><td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a></td></tr><tr> <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>Welcome to Apartmate!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 0 5px;"> Thank you for joining our growing community of Toronto roommates, renters, and landlords. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 35px 5px;">We’re working hard to bring you the best rental resource in the city. If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <a href="http://www.apartmate.ca/" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">Get Started</button> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a></td></tr></table> </body></html>'
        html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css"> .ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"> <tr> <td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"> <table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" > <tr> <td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a> </td></tr><tr> <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>You\'re almost there!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 25px 5px;">Just one more step to get started.</h2> <a href="http://' + _url + '/?email=' + _email + '&token=' + _token + '" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">Activate Your Account</a> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 25px 0 35px 5px;">If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 20px 5px;">Sarah & Nikhil</h2> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a> </td></tr></table> </body></html>'
    };

    smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Verify email was sent');
        //return res.send(403, 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.'); 
        //req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');

    });

}


module.exports = {
    signup: function(req, res, next) 
    {
        console.log('req.body.role: ' + req.body.role);
        console.log('req.body.emailRecieve: ' + req.body.emailRecieve);
        console.log('domain: ' + req.headers.host);

        try {
            User.validate(req.body);
        }
        catch(err) {
            console.log('err: ' + err.message);
            return res.send(400, err.message);
        }

        var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
        var key = 'a1rb0rn3';

        var cipher = crypto.createCipher(algorithm, key);  
        var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

        User.addUser(req.body.emailAddress, encrypted, req.body.role, req.body.emailRecieve, function(err, user) 
        {
            if(err === 'UserAlreadyExists') 
                return res.send(403, "That email is already in use. Please try again or log in");
            else if(err)                   
                return res.send(500);

            sendVerifyAccountToUser(user.emailAddress, user.verifiedToken, req.headers.host);
            res.json(200, { "role": user.role, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id }); 

            // req.logIn(user, function(err) 
            // {
            //     if(err)     
            //     { 
            //         next(err); 
            //     }
            //     else        
            //     { 
            //         console.log('user: ' + JSON.stringify(user));
            //         res.json(200, { "role": user.role, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id }); 
            //     }
            // });
        });
    },
    verify: function(req, res, next) 
    {   
        User.verifyUser(req.body.emailAddress, req.body.token, function(err, user)
        {

            if(err)                   
                next(err);
            
            req.logIn(user, function(err) 
            {
                if(err)     
                { 
                    next(err); 
                }
                else        
                { 
                    console.log('user: ' + JSON.stringify(user));
                    res.json(200, { "role": user.role, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id }); 
                }
            });

            // res.json(200, { "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id });

        });
    },   
    loginWithLinkedIn: function(req, res, next) 
    {
        console.log('loginWithLinkedIn - req.user.emailAddress ' + JSON.stringify(req.body));
        console.log('loginWithLinkedIn - req.user.emailAddress ' + req.body.emailAddress);
        // console.log('loginWithLinkedIn - req.user.firstName ' + req.user.firstName);
        passport.authenticate('linkedin', function(err, user) {
            //console.log('')
            //console.log('info: ' + info.message);
            if(err)     
            { 
                console.log('loginWithLinkedIn - err: ' + err);
                return next(err); 
            } else if(!user)   
            { 
                console.log('loginWithLinkedIn - No user found');
                return res.send(200, "LinkedIn Verification Failed"); 
            }

            console.log('loginWithLinkedIn - linkedInProfile Id: ' + user.profile.id);

            User.addLinkedInUser(req.user.emailAddress, user, function(err, userCreated)
            {

                if (!err && userCreated)
                {
                    console.log('loginWithLinkedIn - LinkedIn Verification Complete');

                    var facebookVerified = false;
                    var linkedInVerified = false;
                    if (userCreated.provider.length > 0)
                    {
                        for (var p = 0; p < userCreated.provider.length; p++)
                        {
                            if (userCreated.provider[p].name === 'facebook')
                                facebookVerified = true;

                            if (userCreated.provider[p].name === 'linkedin')
                                linkedInVerified = true;
                        }
                    }


                    next({ "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': userCreated.apartmateListingCreated, "emailAddress": userCreated.emailAddress, "username": userCreated.emailAddress, "user": userCreated, "userId": userCreated._id })
                    res.redirect('/roommateProfile_part1');
                } else {
                    console.log('loginWithLinkedIn - Error: ' + err);
                    //next({ "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': userCreated.apartmateListingCreated, "emailAddress": userCreated.emailAddress, "username": userCreated.emailAddress, "user": userCreated, "userId": userCreated._id })
                    res.redirect('/roommateProfile_part1');
                }
            });       

            // req.logIn(user, function(err) 
            // {
            //     console.log('user found');
            //     if(err) 
            //     {
            //         return next(err);
            //     }

            //     //if(req.body.rememberme) 
            //     //{
            //         console.log('user wants to be remembered');
            //         req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
            //     //}
                
            //     console.log('user id: ' + user._id);
            //     console.log('user: ' + JSON.stringify(user));
            //     console.log('user: ' + user.apartmateListingCreated);
            //     var facebookVerified = false;
            //     var linkedInVerified = false;
            //     if (user.provider.length > 0)
            //     {
            //         for (var p = 0; p < user.provider.length; p++)
            //         {
            //             if (user.provider[p].name === 'facebook')
            //                 facebookVerified = true;

            //             if (user.provider[p].name === 'linkedin')
            //                 linkedInVerified = true;
            //         }
                
            //     }
            //     next({ "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': user.apartmateListingCreated, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id })
            //     res.redirect('/roommateProfile_part1');
            //     //res.json(200, { "role": user.role, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id });
            // });
        })(req, res, next);
    },

    loginWithFacebook: function(req, res, next) 
    {
        console.log('req.body: ' + JSON.stringify(req.body));
        console.log('req.user: ' + JSON.stringify(req.user));
        console.log('req: ' + req);
        passport.authenticate('facebook', function(err, user, info) {
            //console.log('')
            //console.log('info: ' + info.message);
            if(err)     
            { 
                console.log('err: ' + err);
                return next(err); 
            }

            if(!user)   
            { 
                console.log('no user ');
                return res.send(403, info.message); 
            }

            req.logIn(user, function(err) 
            {
                console.log('user found');
                if(err) 
                {
                    return next(err);
                }

                //if(req.body.rememberme) 
                //{
                    console.log('user wants to be remembered');
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                //}
                
                console.log('user id: ' + user._id);
                console.log('user: ' + JSON.stringify(user));
                console.log('user: ' + user.apartmateListingCreated);
                // console.log(user.provider[0].credentials.profile.gender);

                // sendWelcomeEmailToUser(req.user.emailAddress);
                
                var facebookVerified = false;
                var linkedInVerified = false;
                if (user.provider.length > 0)
                {
                    for (var p = 0; p < user.provider.length; p++)
                    {
                        if (user.provider[p].name === 'facebook')
                            facebookVerified = true;

                        if (user.provider[p].name === 'linkedin')
                            linkedInVerified = true;
                    }
                
                }
                next({ "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': user.apartmateListingCreated, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id, "selectedGender": user.provider[0].credentials.profile.gender })
                res.redirect('/search');
                //res.json(200, { "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': user.apartmateListingCreated, "emailAddress": user.emailAddress, "username": user.emailAddress, "user": user, "userId": user._id });
            });
        })(req, res, next);
    },
    login: function(req, res, next) 
    {
        console.log('req: ' + JSON.stringify(req.body));
        passport.authenticate('local', function(err, user, info) {
            console.log('info: ' + info.message);
            if(err)     
            { 
                return next(err); 
            }

            if(!user)   
            { 
                return res.send(403, info.message); 
            }
            if(!user.verifiedUser){
                return next("You are not verified. Please check your email and click to verify your account");
            } else {
                req.logIn(user, function(err) 
                {
                    if(err) 
                    {
                        return next(err);
                    }
                    // console.log(user.username);
                    user.username = user.firstName;
                    // console.log(user.username);

                    console.log('user wants to be remembered');
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                    
                    console.log(user);
                    console.log('user id: ' + user._id);
                    console.log('user: ' + JSON.stringify(user));
                    var facebookVerified = false;
                    var linkedInVerified = false;
                    if (user.provider.length > 0)
                    {
                        for (var p = 0; p < user.provider.length; p++)
                        {
                            if (user.provider[p].name === 'facebook')
                                facebookVerified = true;

                            if (user.provider[p].name === 'linkedIn')
                                linkedInVerified = true;
                        }
                    
                    }

                    console.log('user: ' + user.apartmateListingCreated);
                    res.json(200, { "role": {"bitMask":2,"title":"user"}, "facebookVerified": facebookVerified, "linkedInVerified": linkedInVerified, 'apartmateListingCreated': user.apartmateListingCreated, 'profileCreated': user.profileCreated, "emailAddress": user.emailAddress, "username": user.firstName, "firstName": user.firstName, "user": user, "userId": user._id });
                }); 
            }
            
        })(req, res, next);
    },

    resetPassword: function(req, res, next) 
    {
        console.log('req: ' + JSON.stringify(req.body));
        passport.authenticate('local', function(err, user) {

            if(err)     
            { 
                return next(err); 
            }

            if(!user)   
            { 
                console.log('no user man');
                return res.send(400); 
            }

            req.logIn(user, function(err) 
            {
                if(err) 
                {
                    return next(err);
                }

                if(req.body.rememberme) 
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                

                console.log('user: ' + JSON.stringify(user));
                res.json(200, { "role": user.role, "emailAddress": user.emailAddress });
            });
        })(req, res, next);
    },

    forgotPassword: function(req, res, next) 
    {
        console.log('req: ' + JSON.stringify(req.body));
        var decrypted = '';
        async.waterfall(
        [
            function(done) 
            {
                crypto.randomBytes(20, function(err, buf) 
                {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) 
            {
                ApartmateUser.findOne({ 'emailAddress': req.body.emailAddress }, function(err, user) 
                {
                    if (!user) 
                    {
                        console.log('no such user');
                        
                        return res.send(400, { message: "Sorry, we don't recognize that email address. Please try again or create an account."});
                    } else 
                    {
                        console.log('user exists');
                        console.log(user);

                        var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
                        var key = 'a1rb0rn3';
                        var decipher = crypto.createDecipher(algorithm, key);
                        decrypted = decipher.update(user.password, 'hex', 'utf8') + decipher.final('utf8');

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err) 
                        {   

                            console.log('token was set');
                            done(err, token, user);
                        });


                    }

                    
                });
            },
            function(token, user, done) 
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
                    to: user.emailAddress,
                    from: 'info@apartmate.ca',
                    subject: 'Apartmate Password',
                    text: 'Your password: ' + decrypted + '\n\n'
                    /*text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    */
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    console.log('Email was sent');
                    //return res.send(403, 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.'); 
                    //req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');
                    
                    if (err)
                        done(err, null);
                    else
                        done(null, user);
                });
            }
        ], function(err, user) 
            {   console.log("What is this error?")
                console.log(err);
                if (err) 
                {
                    return res.send(400, { message: "Unknown error, please try again"}); 
                } else 
                {
                    if (typeof(user) === 'string')
                        res.json(200, { message: user });
                    else 
                        res.json(200, { message: 'Sent your password to ' + user.emailAddress });
                
                   // res.json(200, { "message": 'Sent you an email at ' + user.emailAddress + 'with further instructions on how to reset.'});
                }

                
                
        });

    },

    getPropertyListingsByUser: function(req, res, next)
    {
        console.log('getPropertyListingsByUser');
        console.log('req:' + req.body.user.emailAddress);
        ApartmateUser.findOne({ 'emailAddress': req.body.user.emailAddress }, function(err, user) 
        {
            if (!user) 
            {
                console.log('no such user');
                
                return res.send(403, { message: "Please login and try again"});
            } else 
            {
                console.log('user exists: ' + user.id);


                PropertyListing.findManyByUserId(user.id, function(err, properties)
                {
                    if (err || !properties)
                    {
                        properties = new Array();
                        console.log('Error: ' + err);
                        res.json(200, { "properties": properties });
                    } else 
                    {
                        console.log('Was able to retrieve properties');
                        res.json(200, { "properties": properties });
                    }
                });

                
            }

            
        });
    },

    getPropertyListingById: function(req, res, next)
    {
        console.log('getPropertyListingsByUser');
        console.log('req:' + req.body.user.emailAddress);
        console.log('req:' + req.body.propertyId);



        PropertyListing.findListingById(req.body.propertyId, function(err, property)
        {
            if (err || !property)
            {
                properties = new Array();
                console.log('Error: ' + err);
                res.json(200, { "property": property });
            } else 
            {
                console.log('Was able to retrieve property');
                res.json(200, { "property": property });
            }
        });
    },

    getPropertyById: function(req, res, next)
    {
        console.log('getPropertyListingsByUser');
        console.log('req:' + req.body.propertyId);



        PropertyListing.findListingById(req.body.propertyId, function(err, property)
        {
            if (err || !property)
            {
                properties = new Array();
                console.log('Error: ' + err);
                res.json(200, { "property": property });
            } else 
            {
                console.log('Was able to retrieve property');
                res.json(200, { "property": property });
            }
        });
    },

    addToFavorites: function(req, res, next)
    {
        console.log('req:' + req.body.user.emailAddress);
        ApartmateUser.findOne({ 'emailAddress': req.body.user.emailAddress }, function(err, user) 
        {
            if (!user) 
            {
                console.log('no such user');
                
                return res.send(403, { message: "Please login and try again"});
            } else 
            {
                console.log('user exists');

                user.favoriteProperties = req.body.user.favoriteProperties;

                user.save(function(err) 
                {
                    console.log('favorite properties set');
                    res.json(200, { message: 'Done' });
                });


            }

            
        });
    },

    removeFromFavorites: function(req, res, next)
    {
        console.log('req:' + req.body.user.emailAddress);
        ApartmateUser.findOne({ 'emailAddress': req.body.user.emailAddress }, function(err, user) 
        {
            if (!user) 
            {
                console.log('no such user');
                
                return res.send(403, { message: "Please login and try again"});
            } else 
            {
                console.log('user exists');

                user.favoriteProperties = req.body.user.favoriteProperties;

                user.save(function(err) 
                {
                    console.log('favorite properties removed');
                    res.json(200, { message: 'Done' });
                });


            }

            
        });
    },

    getFavoriteProperties: function(req, res, next)
    {
        console.log('helooo');
        console.log('req:' + req.body.user.emailAddress);
        ApartmateUser.findOne({ 'emailAddress': req.body.user.emailAddress }, function(err, user) 
        {
            if (!user) 
            {
                console.log('no such user');
                
                return res.send(403, { message: "Please login and try again"});
            } else 
            {
                console.log('user exists');
                console.log('how many favorites: ' + user.favoriteProperties.length);

                PropertyListing.findManyById(user.favoriteProperties, function(err, properties)
                {
                    if (err || !properties)
                    {
                        properties = new Array();
                        console.log('Error: ' + err);
                        res.json(200, { "properties": properties });
                    } else 
                    {
                        console.log('Was able to retrieve properties');
                        res.json(200, { "properties": properties });
                    }
                });

                
            }

            
        });
    },


    logout: function(req, res) 
    {
        req.logout();
        res.send(200);
    }
};