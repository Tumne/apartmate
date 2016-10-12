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


var PropertyListing = require('../../models/PropertyListing.js');
var SharedPropertyListing = require('../../models/SharedPropertyListing.js');
var PropertyImages = require('../../models/PropertyImages.js');
var GatheredListings = require('../../models/GatheredListings.js');


//var config = require('./config');

cloudinary.config({ 
  cloud_name: 'apartmate', 
  api_key: '234246189352792', 
  api_secret: 'qsmacJuNzV9AnXFVgCjbUsSvV68' 
})

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

routes = function (app) 
{

	app.namespace('/properties', function () 
	{

        app.post('/api/publish', function(req, res, next)
        {
          console.log('/api/publish: ' + req.body.property._id);
            // Find all images with the attached property ID
            PropertyImages.find({propertyId: req.body.property._id}, function(err, propertyImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + propertyImages);
                console.log(propertyImages.length);
                console.log('!Array.isArray(propertyImages): ' + !Array.isArray(propertyImages));
                if (err || !propertyImages || propertyImages.length === 0)
                {
                    console.log(err);
                    console.log(propertyImages);
                    console.log(propertyImages.length);
                    console.log('Error with /api/publish Post function');
                    res.send({ success: 0, message: "/api/publish failed", errorCode: 'E404-1' });
                }
                else
                {
                    console.log('The /api/publish call went through...');

                    if (propertyImages)
                    {

                        console.log('Find the PropertyModel with the PropertyID');
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
                                var previousBytes = '';
                                propertyImages.forEach( function (propertyImage) {
                                    //if (propertyImage.bytes != previousBytes)
                                    //{
                                      //  previousBytes = propertyImage.bytes;
                                        existingProperty.addedImages.push({"url": propertyImage.url, "id": propertyImage.id, "bytes": propertyImage.bytes});
                                        //propertyImage.remove();
                                    //} 
                                });
                                    
                                existingProperty.save(function(err, propertySaved)
                                {
                                    if (!err)
                                    {
                                      // res.contentType('application/json');
                                      // res.send({ success: 1, message: "/api/publish successful"});
                                      res.json(200, { "property": propertySaved });
                                      console.log("We got here");

                                    }
                                    else 
                                    {
                                        res.contentType('application/json');
                                        res.send({ success: 0, message: "/api/publish failed"});
                                    }
                                });

                            }
                        });
  
                        console.log('Delete Images from PropertyImages and Save Model');
                        propertyImages.forEach( function (propertyImage) {
                          propertyImage.remove();
                        });
                        
                    }
                }
            });
            
        });

        //Handle uploads through Flow.js
        app.post('/api/upload', multipartMiddleware, function(req, res) {
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
                              bytes: result.bytes,
                              filename: filename,
                              published: false
                            };

                            saveWholePropertyImages(imageObj).then(function(propertyImages)
                            {
                                //callback(null, properties);    
                                console.log('Image saved');
                            }).catch(function(reason)
                            {
                                console.log('reason: ' + reason);
                               // callback(reason, null);
                            });
                            
                            console.log(result.url);
                            
                            res.contentType('application/json')
                            res.send({ success: 1, message: "Add picture successful" });
                            
                        }
                        
                    });
                }
            });

          });
        });

        app.post('/api/remove', function(req, res, next)
        {
            console.log('yo: ' + req.body.property.filename);
            // Find all images with the attached property ID
            PropertyImages.find({filename: req.body.property.filename}, function(err, propertyImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + propertyImages);
                console.log(propertyImages.length);
                console.log('!Array.isArray(propertyImages): ' + !Array.isArray(propertyImages));
                if (err || !propertyImages || propertyImages.length === 0)
                {
                    console.log('Error with /api/publish Post function');
                    res.send({ success: 0, message: "/api/publish failed", errorCode: 'E404-1' });
                }
                else
                {
                    
                    console.log('Delete Images from PropertyImages and Save Model');
                    propertyImages.forEach( function (propertyImage) {
                      propertyImage.remove();
                    });
                        
                }
            });
            
        });

        app.post('/api/removeAll', function(req, res, next)
        {
            
            PropertyImages.find({propertyId: req.body.property._id}, function(err, propertyImages)
            {
                res.contentType('text/json');
                console.log('found listing:  ' + propertyImages);
                console.log(propertyImages.length);
                console.log('!Array.isArray(propertyImages): ' + !Array.isArray(propertyImages));
                if (err || !propertyImages || propertyImages.length === 0)
                {
                    console.log('Error with /api/removeAll Post function');
                    res.send({ success: 0, message: "/api/removeAll failed", errorCode: 'E404-1' });
                }
                else
                {
                    
                    console.log('Delete Images from PropertyImages and Save Model');
                    propertyImages.forEach( function (propertyImage) {
                      propertyImage.remove();
                    });
                        
                }
            });
            
        });

        function saveWholePropertyImages(imgProperty)
        {
            var promise = new RSVP.Promise(function(resolve, reject)
            {

                var propertyImage = PropertyImages();
                propertyImage.url = imgProperty.url;
                propertyImage.propertyId = imgProperty.id;
                propertyImage.filename = imgProperty.filename;
                propertyImage.published = false;
               
                // Save new property listing
                propertyImage.save(function(err, newImageCreated) 
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


        app.options('/api/upload', function(req, res){
          console.log('OPTIONS');
          if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
          }
          res.status(200).send();
        });

        app.post('/api/upload', function(req, res){
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
        app.get('/api/upload', function(req, res){
          flow.get(req, function(status, filename, original_filename, identifier){
            console.log('GET', status);
            res.send(200, (status == 'found' ? 200 : 404));
          });
        });
    
    });


}

module.exports = routes;