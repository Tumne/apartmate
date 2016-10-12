process.env.TMPDIR = 'tmp';

//var config = require('../../../config');
var inspect = require('util').inspect;
//var request = require('request');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('../../../flow-node.js')('tmp');
var fs = require('fs');
var cloudinary = require('cloudinary');
var RSVP = require('rsvp');
var nodemailer =  require('nodemailer');
var async =  require('async');


var ApartmateUser = require('../../models/ApartmateUser.js');
var SharedPropertyListing = require('../../models/SharedPropertyListing.js');
var PeopleImages = require('../../models/PeopleImages.js');
var GatheredListings = require('../../models/GatheredListings.js');


//var config = require('./config');

cloudinary.config({ 
  cloud_name: 'apartmate', 
  api_key: '234246189352792', 
  api_secret: 'qsmacJuNzV9AnXFVgCjbUsSvV68' 
})

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


function sendEmailtoApartmate(_email)
{

    console.log('sendEmailtoApartmate');
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
        subject: 'New profile created at Apartmate',
        text: 'Congratulations!\n\n\n Your Apartmate profile has been created and will appear in search results shortly. \n Your listing will remain active for 30 days.\n\n\n You can view, edit, delete or deactivate your listing by clicking in the My Profile page. \n If you have any questions, feedback or would just like to say hello, \n we would love to hear from you at info@apartmate.ca.\n\n\n Thank you for using Apartmate! \n\n\n View my Listing here: \n http://www.apartmate.ca/\n\n\n Check us out on Facebook: \n https://www.facebook.com/ApartmateCanada\n\n\n Tweet us on twitter: \n https://twitter.com/apartmatecanada',
        // html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css">.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"><table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" ><tr><td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a></td></tr><tr>` <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>Congratulations!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 0 5px;"> Your Apartmate profile has been created and will appear in search results shortly. Your profile will remain active for 30 days. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 35px 5px;"> You can view, edit, or deactivate your profile by clicking on the button below. If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <a href="http://www.apartmate.ca/" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">View my profile</button> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a></td></tr></table> </body></html>'
        html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css">.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"><table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" ><tr><td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a></td></tr><tr> <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>Congratulations!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 0 5px;"> Your Apartmate profile has been created and will appear in search results shortly. Your profile will remain active for 30 days. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 35px 5px;"> You can view, edit, or deactivate your profile by clicking on the button below. If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <a href="http://www.apartmate.ca/?redirect=myProfile" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">View my profile</button> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a></td></tr></table> </body></html>'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        console.log('sendEmailtoApartmate - err: ' + err);
        console.log('Email was sent');
        //return res.send(403, 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.'); 
        //req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');

    });

}


String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

routes = function (app) 
{

	app.namespace('/profile', function () 
	{

        app.post('/api/publish', function(req, res, next)
        {
            console.log('property: ' + req.body.property._id);
            console.log('apartmate: ' + req.body.apartmate._id);
            // Find all images with the attached property ID
            PeopleImages.find({propertyId: req.body.property._id}, function(err, profileImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + profileImages);

                console.log(profileImages.length);
                console.log('!Array.isArray(profileImages): ' + !Array.isArray(profileImages));
                if (err || !profileImages || profileImages.length === 0)
                {
                  if(req.body.apartmate.addedProfileImages.length > 0){

                    GatheredListings.findById(req.body.property._id, function (err, existingProperty) 
                    { 
                        
                        if (err || !existingProperty)
                        {
                            console.log('err: ' + err);
                           // resolve("");
                        }
                        else {
                            console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                            
                            //console.log(' Update Property Model with the Images and save PropertyModel');

                            req.body.apartmate.addedProfileImages.forEach( function (profileImage) {
                              existingProperty.addedProfileImages.push({"url": profileImage.url, "id": profileImage.id});
                            });

                            existingProperty.save(function(err, propertySaved)
                            {
                                if (!err)
                                {
                                  console.log("propertySaved");
                                  res.contentType('application/json');
                                  res.send({ success: 1, message: "/api/publish successful", propertySaved: propertySaved, profileSaved: req.body.apartmate});                                 
                                }
                                else 
                                {
                                    res.contentType('application/json');
                                    res.send({ success: 0, message: "/api/publish failed"});
                                }
                            });

                        }
                    });

                  } else {
                    console.log('Error with /api/publish Post function');
                    res.send({ success: 0, message: "/api/publish failed", errorCode: 'E404-1' });
                  }
                    
                }
                else
                {
                    console.log('The /api/publish call went through...');

                    if (profileImages)
                    {

                        var fn1 = function(done){

                            GatheredListings.findById(req.body.property._id, function (err, existingProperty) 
                            { 
                                
                                if (err || !existingProperty)
                                {
                                    console.log('err: ' + err);
                                   // resolve("");
                                }
                                else {
                                    console.log('Property exists at this street address: ' + existingProperty.streetAddress);
                                    
                                    //console.log(' Update Property Model with the Images and save PropertyModel');

                                    profileImages.forEach( function (profileImage) {
                                      existingProperty.addedProfileImages.push({"url": profileImage.url, "id": profileImage.id});
                                    });

                                    existingProperty.save(function(err, propertySaved)
                                    {
                                        if (!err)
                                        {
                                          console.log("propertySaved");
                                          done(null, profileImages, propertySaved);
                                          // res.contentType('application/json');
                                          // res.send({ success: 1, message: "/api/publish successful", profileImages: profileImages});
                                        }
                                        else 
                                        {
                                            res.contentType('application/json');
                                            res.send({ success: 0, message: "/api/publish failed"});
                                        }
                                    });

                                }
                            });

                        };
                        var fn2 = function(profileImages, propertySaved, done){

                          ApartmateUser.findById(req.body.apartmate._id, function (err, existingProfile) 
                          { 
                              
                              if (err || !existingProfile)
                              {
                                  console.log('err: ' + err);
                                 // resolve("");
                              }
                              else {
                                  console.log('Profile found with email ' + existingProfile.emailAddress);
                                  
                                  //console.log(' Update Property Model with the Images and save PropertyModel');
                                  existingProfile.addedProfileImages = new Array();
                                  existingProfile.addedProfileImages.push({"url": profileImages[0].url, "id": profileImages[0].id})
                                  // profileImages.forEach( function (profileImage) {
                                  //   existingProfile.addedProfileImages.push({"url": profileImage.url, "id": profileImage.id});
                                  // });
                                  if(existingProfile.addedProfileImages.length > 0 && existingProfile.firstName != null && existingProfile.lifestyle != null && existingProfile.selectedGender != null && existingProfile.personalDescription != null){
                                      existingProfile.activeProfile = true;
                                      if(!existingProfile.profileCreated){
                                          console.log("Send email");
                                          sendEmailtoApartmate(existingProfile.emailAddress);
                                          existingProfile.profileCreated = true;
                                      }
                                  } else {
                                      existingProfile.activeProfile = false;
                                  }
                                  
                                  existingProfile.profileCreated = true;

                                  console.log(existingProfile);

                                  existingProfile.save(function(err, profileSaved)
                                  {
                                      if (!err)
                                      {
                                        console.log("profileSaved");
                                        done(null, profileImages, propertySaved, profileSaved);
                                        // res.contentType('application/json');
                                        // res.send({ success: 1, message: "/api/publish successful", profileSaved: profileSaved});
                                      }
                                      else 
                                      {   
                                          console.log("err");
                                          res.contentType('application/json');
                                          res.send({ success: 0, message: "/api/publish failed"});
                                      }
                                  });

                              }
                          });

                        };


                        async.waterfall([fn1, fn2],
                            function(err, profileImages, propertySaved, profileSaved){
                            console.log("done");
                            console.log(profileImages);
                            console.log(propertySaved);
                            console.log(profileSaved);


                            res.contentType('application/json');
                            res.send({ success: 1, message: "/api/publish successful", propertySaved: propertySaved, profileSaved: profileSaved});

                            profileImages.forEach( function (profileImage) {
                              profileImage.remove();
                            });

                        }); 
  
                        // console.log('Delete Images from profileImages and Save Model');
                        // profileImages.forEach( function (profileImage) {
                        //   profileImage.remove();
                        // });
                        
                    } 

                }
            });
            
        });


        //Handle uploads through Flow.js
        app.post('/api/uploadToShared', multipartMiddleware, function(req, res) {
          flow.post(req, function(status, filename, original_filename, identifier, propertyId) {
            console.log('POST', status, original_filename, identifier, propertyId);
            console.log('propertyId: ' + propertyId);
            console.log('filename: ' + filename);
            var stream = fs.createWriteStream('tmp' + '/' + filename);
            flow.write(identifier, stream, { onDone: flow.clean }, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    //call mv() here
                    console.log('Finally done');
                    var newPath = 'tmp' + '/' + filename;
                    console.log('newPath: ' + newPath);
                    cloudinary.uploader.upload(newPath, function(result) { 
                        if (!result)
                        {
                            console.log('Not able to save for whatever reason, no error provided?');
                        }
                        else {

                            console.log(result);
                            //console.log(result.public_id);

                            console.log('image was uploaded to cloudinary');
                            //res.contentType('application/json')d
                            //var str = "" + result.url + " ";
                            //var id = result.id;
                            //var thumbURL = str.splice( str.indexOf('/v'), 0, "/c_scale,w_300" );
                            //offer.picture =result;

                            var imageObj = 
                            {
                              url: result.url,
                              id: propertyId,
                              filename: filename,
                              published: false
                            };

                            saveWholeprofileImages(imageObj).then(function(profileImages)
                            {
                                //callback(null, properties);    
                                console.log('Image saved');
                            }).catch(function(reason)
                            {
                                console.log('reason: ' + reason);
                               // callback(reason, null);
                            });
                            
                            console.log(result.url);
                            
                            //restaurantService.addMenuItemPicture({userID: req.body.userID, apiToken: req.body.token, menuItemId: req.body.menuItemId, pictureUrl: result, pictureId: id, 
                            //caption: req.body.caption, menuItemIndexId: req.body.menuItemIndexId, menuId: req.body.menuId}, function (err, existingItem)
                            //{
                                //res.contentType('application/json')
                                //res.send({ success: 1, message: "Add picture successful" });
                            //});
                        }
                        
                    });
                }
            });

            if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
              res.header("Access-Control-Allow-Origin", "*");
            }
            res.status(status).send();
          });
        });


        //Handle uploads through Flow.js
        app.post('/api/uploadToApartmate', multipartMiddleware, function(req, res) {
            

            console.log(req);

          flow.post(req, function(status, filename, original_filename, identifier, apartmateUserId) {
            console.log('POST', status, original_filename, identifier, apartmateUserId);
            console.log('apartmateUserId: ' + apartmateUserId);
            console.log('filename: ' + filename);
            var stream = fs.createWriteStream('tmp' + '/' + filename);
            flow.write(identifier, stream, { onDone: flow.clean }, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    //call mv() here
                    console.log('Finally done');
                    var newPath = 'tmp' + '/' + filename;
                    console.log('newPath: ' + newPath);
                    cloudinary.uploader.upload(newPath, function(result) { 
                        if (!result)
                        {
                            console.log('Not able to save for whatever reason, no error provided?');
                        }
                        else {

                            console.log(result);
                            //console.log(result.public_id);

                            console.log('image was uploaded to cloudinary');
                            //res.contentType('application/json')d
                            //var str = "" + result.url + " ";
                            //var id = result.id;
                            //var thumbURL = str.splice( str.indexOf('/v'), 0, "/c_scale,w_300" );
                            //offer.picture =result;

                            var imageObj = 
                            {
                              url: result.url,
                              id: apartmateUserId,
                              filename: filename,
                              published: false
                            };

                            saveApartmateImages(imageObj).then(function(profileImages)
                            {
                                //callback(null, properties);    
                                console.log('Image saved');
                            }).catch(function(reason)
                            {
                                console.log('reason: ' + reason);
                               // callback(reason, null);
                            });
                            
                        }
                        
                    });
                }
            });

            if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
              res.header("Access-Control-Allow-Origin", "*");
            }
            res.status(status).send();
          });
        });

        app.post('/api/publishProfile', function(req, res, next)
        {
            console.log('/api/publishProfile: ' + req.body.apartmate._id);
            // Find all images with the attached property ID
            PeopleImages.find({apartmateUserId: req.body.apartmate._id}, function(err, profileImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + profileImages);
                console.log(profileImages.length);
                console.log('!Array.isArray(profileImages): ' + !Array.isArray(profileImages));
                if (err || !profileImages || profileImages.length === 0)
                {
                    console.log('Error with /api/publish Post function');
                    res.send({ success: 0, message: "/api/publish failed", errorCode: 'E404-1' });
                }
                else
                {
                    console.log('The /api/publish call went through...');

                    if (profileImages)
                    {

                        console.log('Find the ApartmateUser with the Apartmate ID');
                        ApartmateUser.findById(req.body.apartmate._id, function (err, existingProfile) 
                        { 
                            
                            if (err || !existingProfile)  
                            {
                                console.log('err: ' + err);
                               // resolve("");
                            }
                            else {
                                console.log('Profile found with email ' + existingProfile.emailAddress);
                                console.log(existingProfile);
                                //console.log(' Update Property Model with the Images and save PropertyModel');
                                existingProfile.addedProfileImages = new Array();
                                existingProfile.addedProfileImages.push({"url": profileImages[0].url, "id": profileImages[0].id})
                                // profileImages.forEach( function (profileImage) {
                                //   existingProfile.addedProfileImages.push({"url": profileImage.url, "id": profileImage.id});
                                // });
                                if(existingProfile.addedProfileImages.length > 0 && existingProfile.firstName != null && existingProfile.lifestyle != null && existingProfile.selectedGender != null && existingProfile.personalDescription != null){
                                    existingProfile.activeProfile = true;
                                    console.log("existingProfile.profileCreated: " +  existingProfile.profileCreated);
                                    if(!existingProfile.profileCreated){
                                        console.log("Send email");
                                        sendEmailtoApartmate(existingProfile.emailAddress);
                                        existingProfile.profileCreated = true;
                                    }
                                } else {
                                    existingProfile.activeProfile = false;
                                }

                                console.log(existingProfile);

                                existingProfile.save(function(err, profileSaved)
                                {
                                    if (!err)
                                    {
                                        console.log("works");
                                      res.contentType('application/json');
                                      res.send({ success: 1, message: "/api/publish successful", profileSaved: profileSaved});
                                    }
                                    else 
                                    {   
                                        console.log("err");
                                        res.contentType('application/json');
                                        res.send({ success: 0, message: "/api/publish failed"});
                                    }
                                });

                            }
                        });
  
                        console.log('Delete Images from profileImages and Save Model');
                        profileImages.forEach( function (profileImage) {
                          profileImage.remove();
                        });
                        
                    }
                }
            });
            
        });

        app.post('/api/remove', function(req, res, next)
        {
            console.log('removing: ' + req.body.property.filename);
            // Find all images with the attached property ID
            PeopleImages.find({filename: req.body.property.filename}, function(err, profileImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + profileImages);
                console.log(profileImages.length);
                
                if (err || !profileImages || profileImages.length === 0)
                {
                    console.log('Error with /api/publish Post function');
                    res.send({ success: 0, message: "/api/publish failed", errorCode: 'E404-1' });
                }
                else
                {
                    
                    console.log('Delete Images from profileImages and Save Model');
                    profileImages.forEach( function (profileImage) {
                      profileImage.remove();
                    });
                        
                }
            });
            
        });

        function saveApartmateImages(imgProperty)
        {
            var promise = new RSVP.Promise(function(resolve, reject)
            {

                var profileImage = PeopleImages();
                profileImage.url = imgProperty.url;
                profileImage.apartmateUserId = imgProperty.id;
                profileImage.filename = imgProperty.filename;
                profileImage.published = false;
               
                // Save new property listing
                profileImage.save(function(err, newImageCreated) 
                {
                    if (err)
                    {
                        console.log('Error with adding new image: ' + err);
                        reject('Image Creation failed');
                    } else 
                    {
                        console.log('Image was created');
                        resolve(newImageCreated);
                    }
                });

            });

            return promise;
        }

        function saveWholeprofileImages(imgProperty)
        {
            var promise = new RSVP.Promise(function(resolve, reject)
            {

                var profileImage = PeopleImages();
                profileImage.url = imgProperty.url;
                profileImage.propertyId = imgProperty.id;
                profileImage.filename = imgProperty.filename;
                profileImage.published = false;
               
                // Save new property listing
                profileImage.save(function(err, newImageCreated) 
                {
                    if (err)
                    {
                        console.log('Error with adding new image: ' + err);
                        reject('Image Creation failed');
                    } else 
                    {
                        console.log('Image was created');
                        resolve(newImageCreated);
                    }
                });

            });

            return promise;
        }


        app.options('/api/uploadToShared', function(req, res){
          console.log('OPTIONS');
          if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
          }
          res.status(200).send();
        });

        app.post('/api/uploadToShared', function(req, res){
          flow.post(req, function(status, filename, original_filename, identifier){
            console.log('POST', status, original_filename, identifier);
            console.log('filename: ' + filename);
            res.send(200, {
              // NOTE: Uncomment this funciton to enable cross-domain request.
              'Access-Control-Allow-Origin': '*'
            });
          });
        });

        // Handle status checks on chunks through Flow.js
        app.get('/api/uploadToShared', function(req, res){
          flow.get(req, function(status, filename, original_filename, identifier){
            console.log('GET', status);
            res.send(200, (status == 'found' ? 200 : 404));
          });
        });

        // Apartmate
        app.options('/api/uploadToApartmate', function(req, res){
          console.log('OPTIONS');
          if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
          }
          res.status(200).send();
        });

        app.post('/api/uploadToApartmate', function(req, res){
          flow.post(req, function(status, filename, original_filename, identifier){
            console.log('POST', status, original_filename, identifier);
            console.log('filename: ' + filename);
            res.send(200, {
              // NOTE: Uncomment this funciton to enable cross-domain request.
              'Access-Control-Allow-Origin': '*'
            });
          });
        });

        // Handle status checks on chunks through Flow.js
        app.get('/api/uploadToApartmate', function(req, res){
          flow.get(req, function(status, filename, original_filename, identifier){
            console.log('GET', status);
            res.send(200, (status == 'found' ? 200 : 404));
          });
        });

    
    });





}

module.exports = routes;