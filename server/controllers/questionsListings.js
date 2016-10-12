
var QuestionsListing = require('../models/QuestionsListing.js');
var CreatedQuestionsListing = require('../models/CreatedQuestionsListing.js');


module.exports = {
    
    getQuestionsListings: function(req, res, next)
    {
        console.log("getQuestionsListings");

        QuestionsListing.getAllQuestions(function(err, questionsListing) {
            if(err) {
                console.log('Err: ' + err);
                next(err);
            } else {
                res.json(200, { "questionsListing": questionsListing });
            }
        });

    },

    addQuestionById: function(req, res, next)
    {
        console.log("getQuestionsListings");

        QuestionsListing.addQuestionById(req.body.email, req.body.result, req.body.completed, function(err, propertySaved, userSaved) {
            if(err) {
                console.log('Err: ' + err);
                next(err);
            } else {
                res.json(200, { "propertySaved": propertySaved,  "userSaved": userSaved});
            }
        });

    },
    addCreatedQuestion: function(req, res, next)
    {
        console.log("getQuestionsListings");

        CreatedQuestionsListing.addCreatedQuestion(req.body.createdQuestion, function(err, createdQuestion) {
            if(err) {
                console.log('Err: ' + err);
                next(err);
            } else {
                res.json(200, { "createdQuestion": createdQuestion});
            }
        });

    }
};