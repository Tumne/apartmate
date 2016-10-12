process.env.TMPDIR = 'tmp'; 

var passport =  require('passport');
var PropertyListing = require('../models/PropertyListing.js');
var SharedPropertyListing = require('../models/SharedPropertyListing.js');

var nodemailer =  require('nodemailer');
var async =  require('async');
var request = require('request');

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

var geocodingURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var geocodingParams = "1600+Amphitheatre+Parkway,+Mountain+View,+CA";
var geocodingAPIKey = "&key=AIzaSyB7BStT0DdM2kYc-p7XontpY4i1EAU3ejA";


function sendEmailtoApartmate(_listingID, emailAddress)
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
        to: emailAddress,
        bcc: 'info@apartmate.ca',
        from: 'info@apartmate.ca',
        subject: 'New listing posted on Apartmate',
        text: 'Congratulations!\n\n\n Your Apartmate listing has been created and will appear in search results shortly. \n Your listing will remain active for 30 days.\n\n\n You can view, edit, delete or deactivate your profile in the My Listings page. \n If you have any questions, feedback or would just like to say hello, \n we would love to hear from you at info@apartmate.ca.\n\n\n Thank you for using Apartmate! \n\n\n View my Listing here: \n http://www.apartmate.ca/property/' + _listingID + '\n\n\n Check us out on Facebook: \n https://www.facebook.com/ApartmateCanada\n\n\n Tweet us on twitter: \n https://twitter.com/apartmatecanada',
        html: '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>SG Responsive Email Template for Mobile Use</title> <style type="text/css">.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}body{width: 100%; background-color: #ffffff; margin:0; padding:0; -webkit-font-smoothing: antialiased;font-family: Verdana, sans-serif}table{border-collapse: collapse;}@media only screen and (max-width: 640px){body .deviceWidth{width:440px!important; padding:0;}body .center{text-align: center!important;}}@media only screen and (max-width: 480px){body .deviceWidth{width:280px!important; padding:0;}body .center{text-align: center!important;}}</style></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="font-family: Verdana, sans-serif"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td width="100%" valign="top" bgcolor="#ffffff" style="padding-top:20px"><table width="700" class="deviceWidth" style="border: 1px solid gainsboro;" cellpadding="0" cellspacing="0" align="center" ><tr><td valign="top" style="border: 1px solid gainsboro;" bgcolor="#ffffff"> <a href="http://www.apartmate.ca/" target="_blank"><img class="deviceWidth" src="http://www.apartmate.ca/img/logo_horizontal_color.jpg" alt="" border="0" height="59" width="275" max-width="275" max-height="59" min-height="59" style="display: block; border-radius: 10px; padding: 40px;"/></a></td></tr><tr> <td style="font-size: 14px; border: 1px solid gainsboro; border-radius: 10px; font-weight: normal; text-align: left; font-family: Century Gothic, sans-serif; line-height: 24px; vertical-align: top; padding: 40px 40px 70px 40px;" bgcolor=""> <h1>Congratulations!</h1> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 0 5px;"> Your Apartmate listing has been created and will appear in search results shortly. Your listing will remain active for 30 days. </h2> <h2 style="color:#676464; font-size: 17px; line-height: 28px; font-family: Verdana, sans-serif; font-weight:normal; letter-spacing: 0.2px; padding: 15px 0 35px 5px;"> You can view, edit, delete or deactivate your listing by clicking on the button below. If you have any questions, feedback or would just like to say hello, we would love to hear from you at <a href="mailto:info@apartmate.ca">info@apartmate.ca</a>. </h2> <a href="http://www.apartmate.ca/property/' + _listingID + '" target="_blank" style="font-size: 18px; font-family: Century Gothic, sans-serif; font-weight: bold; letter-spacing: 0.75px; text-decoration: none; padding: 15px 50px ; margin: 20px 0 0 5px; border-radius: 3px; background-color: #53c2d2; color: white; border: none;">View my listing</button> </td></tr><tr> <td style="font-size: 13px; border-radius: 10px; font-weight: normal; text-align: center; font-family: Verdana, sans-serif; line-height: 24px; vertical-align: top; padding: 40px" bgcolor=""> <a href="https://www.facebook.com/ApartmateCanada" target="_blank"><img src="http://www.apartmate.ca/img/email_fb.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> <a href="https://twitter.com/apartmatecanada" target="_blank"><img src="http://www.apartmate.ca/img/email_tw.png" border="0" height="60" width="60" max-width="60" max-height="60" min-height="60" style="padding: 0 20px;"/></a> </td></tr></table> <div style="height:15px">&nbsp;</div><a href="#" style="text-align: center; color: rgb(174, 172, 172); text-decoration: none;"><p>To unsubscribe, click here</p></a></td></tr></table> </body></html>'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Email was sent');
        console.log(err);
        // console.log(mailOptions);

        //return res.send(403, 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.'); 
        //req.flash('info', 'An e-mail has been sent to ' + user.emailAddress + ' with further instructions.');

    });

}


module.exports = {
    addPropertyListing: function(req, res, next) 
    {
       // res.json(200, { "Property": "property listing was good"});
        // Error checking
        // try {
        //     PropertyListing.validate(req.body);
        // }
        // catch(err) {
        //     return res.send(400, err.message);
        // }
        var location = '';

        if (req.body.property.streetAddress)
            geocodingParams = req.body.property.streetAddress + "+" + req.body.property.postalCode + '+ON+Canada'
        // else if (req.body.property.postalCode)
            // geocodingParams = req.body.property.postalCode + ',+ON,+Canada'

        console.log(geocodingParams);

        request(geocodingURL+geocodingParams+geocodingAPIKey, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                location = JSON.parse(body);
                console.log('location: ' + location["results"][0]["geometry"]["location"]["lng"]);

                PropertyListing.addOrUpdate(req.body.property, location, function(err, propertyListing) 
                {
                    //console.log('req.body.property: ' + req.body.property);
                    //console.log('req body: ' + req.body);

                    console.log('addOrUpdate');
                    if(err)     
                    { 
                        console.log('Err: ' + err);
                        next(err); 
                    }
                    else        
                    { 
                        console.log("Property Listing was added with ID: " + propertyListing.id);

                        res.json(200, { "property": propertyListing }); 
                    }

                });
            }
        })

                
        

    },

    getLastKnownProperty: function(req, res, next)
    {
        console.log('getLastKnownProperty - req.body.userId id: ' + req.body.userId);
        
        PropertyListing.findListingByUserId(req.body.userId, function(err, propertyListing)
        {
            if(err)     
            { 
                console.log('getLastKnownProperty - Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("getLastKnownProperty -  - Property Listing received with ID: " + propertyListing.id);
                res.json(200, { "property": propertyListing }); 

            }
        });
    },

    updatePropertyPictures: function(req, res, next)
    {
        console.log('req.body.property id: ' + req.body.property.id);
        console.log('req.body.property _id: ' + req.body.property._id);
        PropertyListing.removeExistingPictures(req.body.property, function(err, propertyListing)
        {
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was updated with ID: " + propertyListing.id);
                res.json(200, { "property": propertyListing }); 

            }
        });
    },

    updatePropertyPart2ById: function(req, res, next) 
    {
       console.log('updatePropertyPart2ById: ' + req.body.property._id);
        
        PropertyListing.updateDescription(req.body.property, function(err, propertyListing) 
        {
            //console.log('req.body.property: ' + req.body.property._id);
            //console.log('description: ' + req.body.property.description);

            //console.log('updateDescription');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was updated with ID: " + propertyListing.id);
                console.log(propertyListing);

                res.json(200, { "property": propertyListing }); 

                
            }

        });

    },

    editPropertyListing: function(req, res, next) 
    {
       // res.json(200, { "Property": "property listing was good"});
        // Error checking
        // try {
        //     PropertyListing.validate(req.body);
        // }
        // catch(err) {
        //     return res.send(400, err.message);
        // }
        var location = '';

        if (req.body.property.streetAddress)
            geocodingParams = req.body.property.streetAddress + "+" + req.body.property.postalCode + '+ON+Canada'
        // else if (req.body.property.postalCode)
        //     geocodingParams = req.body.property.postalCode + ',+ON,+Canada'

        request(geocodingURL+geocodingParams+geocodingAPIKey, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                location = JSON.parse(body);
                console.log('location: ' + location["results"][0]["geometry"]["location"]["lng"]);

                PropertyListing.editListing(req.body.property, location, function(err, propertyListing) 
                {
                    //console.log('req.body.property: ' + req.body.property);
                    //console.log('req body: ' + req.body);

                    console.log('Update Listing');
                    if(err)     
                    { 
                        console.log('Err: ' + err);
                        next(err); 
                    }
                    else        
                    { 
                        console.log("Property Listing was updated with ID: " + propertyListing.id);
                        res.json(200, { "property": propertyListing }); 
                    }

                });
            }
        })

                
        

    },

    editSharedPropertyListing: function(req, res, next) 
    {
      
        var location = '';

        if (req.body.property.streetAddress)
            geocodingParams = req.body.property.streetAddress + "+" + req.body.property.postalCode + '+ON+Canada'
        // else if (req.body.property.postalCode)
        //     geocodingParams = req.body.property.postalCode + ',+ON,+Canada'

        request(geocodingURL+geocodingParams+geocodingAPIKey, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                location = JSON.parse(body);
                console.log('location: ' + location["results"][0]["geometry"]["location"]["lng"]);

                SharedPropertyListing.editListing(req.body.property, location, function(err, propertyListing) 
                {
                    //console.log('req.body.property: ' + req.body.property);
                    //console.log('req body: ' + req.body);

                    console.log('Update Listing');
                    if(err)     
                    { 
                        console.log('Err: ' + err);
                        next(err); 
                    }
                    else        
                    { 
                        console.log("Property Listing was updated with ID: " + propertyListing.id);
                        res.json(200, { "property": propertyListing }); 
                    }

                });
            }
        })

                
        

    },

    

    getPropertyListings: function(req, res, next)
    {
        console.log('getPropertyListings');

        PropertyListing.getAllProperties(req.body.requestType, function(err, properties)
        {
            if (err || !properties)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve properties');
                res.json(200, { "properties": properties });
            }
        });
    },

    getPropertyListingsByFilter: function(req, res, next)
    {
        console.log('getPropertyListingsByFilter');

        PropertyListing.getPropertyListingsByFilter(req.body.filterParameters, req.body.email, function(err, properties)
        {
            if (err || !properties)
            {
                console.log('Error: ' + err)
            } else {

                console.log('Was able to retrieve properties');
                res.json(200, { "properties": properties });
            }
        });

    },

    getPropertyListingsByFilterApartmate: function(req, res, next)
    {
        console.log('getPropertyListingsByFilterApartmate');

        PropertyListing.getPropertyListingsByFilterApartmate(req.body.filterParameters, function(err, properties)
        {
            if (err || !properties)
            {
                console.log('Error: ' + err)
            } else 
            {
                console.log('Was able to retrieve Apartmate properties');
                res.json(200, { "properties": properties });
            }
        });

    },
    
    updateAndFinishPropertyById: function(req, res, next) 
    {
       console.log('updateAndFinishPropertyById: ' + req.body.property._id);
        
        PropertyListing.updateAndFinish(req.body.property, req.body.apartmate, function(err, propertyListing, apartmateListing) 
        {
            console.log('req.body.property: ' + req.body.property._id);
            console.log('name: ' + req.body.property.name);
            console.log(req.body.property.emailAddress);

            console.log('updateNameEtAll');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was updated with ID: " + propertyListing.id);
                sendEmailtoApartmate(propertyListing.id, req.body.property.emailAddress);
                res.json(200, { "property": propertyListing, "apartmate": apartmateListing}); 
            }

        });

    },

    addSharedPropertyListing: function(req, res, next) 
    {
        var location = '';

        if (req.body.property.streetAddress)
            geocodingParams = req.body.property.streetAddress + "+" + req.body.property.postalCode + '+ON+Canada'
        // else if (req.body.property.postalCode)
        //     geocodingParams = req.body.property.postalCode + ',+ON,+Canada'

        request(geocodingURL+geocodingParams+geocodingAPIKey, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                location = JSON.parse(body);

                SharedPropertyListing.addOrUpdate(req.body.property, location, function(err, propertyListing) 
                {
                    console.log('req.body.property: ' + req.body.property);
                    console.log('req body: ' + req.body);

                    console.log('addOrUpdate');
                    if(err)     
                    { 
                        console.log('Err: ' + err);
                        next(err); 
                    }
                    else        
                    { 
                        console.log("Property Listing was added with ID: " + propertyListing.id);
                        res.json(200, { "property": propertyListing }); 
                    }

                });
            }
        });
    },

    updateSharedPropertyPart2ById: function(req, res, next) 
    {
        SharedPropertyListing.updateDescription(req.body.property, function(err, propertyListing) 
        {
            console.log('req.body.property: ' + req.body.property._id);
            console.log('description: ' + req.body.property.description);

            console.log('updateDescription');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was updated with ID: " + propertyListing.id);
                res.json(200, { "property": propertyListing }); 
            }

        });
    },

    updateAndFinishSharedPropertyById: function(req, res, next) 
    {

        SharedPropertyListing.updateAndFinish(req.body.property, req.body.apartmate, function(err, propertyListing, apartmateListing)
        {
            console.log('req.body.property: ' + req.body.property._id);
            console.log('name: ' + req.body.property.name);
            

            console.log('updateNameEtAll');
            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was updated with ID: " + propertyListing.id);
                sendEmailtoApartmate(propertyListing.id, req.body.property.emailAddress);
                res.json(200, { "property": propertyListing, "apartmate": apartmateListing}); 
            }

        });
    },

    uploadPropertyPicture: function(req, res, next) 
    {
        try {
            console.log('uploadPropertyPicture hello');
            //console.log('req.filename: ' + req.filename);
            console.dir(req.file);
            console.dir(req.filename); 
            console.dir(req.WebKitFormBoundary68TmbEeZIJhLdptJ);
            var UPLOAD_DIR = __dirname + '/properties/';
            flow.post(req, function(status, filename, original_filename, identifier) {
                console.log('req 1: ' + req);
                console.log('filename: ' + filename);
                console.log('original_filename: ' + original_filename);
                if (status == 'done') {
                    console.log("Done");
                    console.log('filename: ' + filename);
                    var filepath = UPLOAD_DIR + filename;
                    var stream = fs.createWriteStream(filepath);
                    console.log(identifier);
                    flow.write(identifier, stream);
                    flow.clean(identifier);

                    // Here I calculate a hash based on the uploaded file and rename it accordingly.
                    // getHashFromFile(UPLOAD_DIR, filename, function(hash){
                    //     var extension = path.extname(filename);
                    //     fs.rename(UPLOAD_DIR + filename, UPLOAD_DIR + hash + extension, function(err) {
                    //         if ( err ) 
                    //             console.log('ERROR: ' + err);
                    //     });
                    // });
                } else {
                    console.log('status: ' + status);
                }
                if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
                  res.header("Access-Control-Allow-Origin", "*");
                }
                res.status(status).send();
            });
        } catch(err) {
            res.json(200, { "message": err }); 
        }
    },

    deletePropertyListingById: function(req, res, next)
    {
        PropertyListing.deleteListing(req.params.id, function(err){
            console.log('req.params.id: ' + req.params.id);
            console.log('delete Listing');

            if(err)     
            { 
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was deleted with ID: " + req.params.id);
                res.json(200, { "property id": req.params.id }); 
            }
        });
    },

    updatePublishedPropertyListing: function(req, res, next)
    {
        console.log(req.params);
        PropertyListing.updatePublish(req.params.id, function(err, propertyListing){
            console.log('req.params.id: ' + req.params.id);
            console.log('publish Listing');

            if(err)
            {
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was published: " + propertyListing);
                res.json(200, { "property": propertyListing }); 
            }
        });
    },
    updateFBBoost: function(req, res, next)
    {
        console.log(req.body.id);
        PropertyListing.updateFBBoost(req.body.id, function(err, propertyListing){
            console.log('req.params.id: ' + req.body.id);
            console.log('publish Listing');

            if(err)
            {
                console.log('Err: ' + err);
                next(err); 
            }
            else        
            { 
                console.log("Property Listing was published: " + propertyListing);
                res.json(200, { "property": propertyListing }); 
            }
        });
    }
};