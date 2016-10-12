var QuestionsArray = require('./QuestionsArray.js');
var ApartmateUser = require('./ApartmateUser.js');
var GatheredListings = require('./GatheredListings.js');

var async = require('async');

module.exports = {

    getAllQuestions: function(callback)
    {
        console.log("QuestionsArray.getAllProperties");
        QuestionsArray.find({})
        .exec(

            function (err, questions) {

                if (err || !questions) {
                    callback("No questions found", null);
                } else {
                    console.log(questions);
                    callback(null, questions);
                    // callback(null, "Test");

                }

            }
        );
    },
    addQuestionById: function(email, result, completed, callback)
    {
        console.log("QuestionsArray.addQuestionById");

        console.log(email);
        console.log(result);

        var fn1 = function(done){
            
            GatheredListings.update({'email': email}, {$push: { questionsResults: result }}, {multi: true}, function (err, propertiesSaved) {
                
                if (err){
                    console.log('err: ' + err);
                } else
                    done(null, propertiesSaved);

            });

        };

        var fn2 = function(propertySaved, done){

            ApartmateUser.findOne({ 'emailAddress': email}, function (err, existingUser) {
                
                if (err || !existingUser) {
                    console.log('err: ' + err);
                } else {
                    console.log('existingUser exists here ');
                    console.log(existingUser);
                    existingUser.questionsResults.push(result);
                    if(completed) 
                        existingUser.questionsAnswered = completed;

                    existingUser.save(function(err, userSaved) {
                        if(err)
                            callback('Could not save Apartmate', null);

                        done(null, propertySaved, userSaved);

                    });
                }

            });

        };


        async.waterfall([fn1, fn2], function(err, propertySaved, userSaved){
            console.log(propertySaved);
            console.log(userSaved);
            callback(null, propertySaved, userSaved);
        });
    },
};