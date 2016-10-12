var CreatedQuestionsArray = require('./CreatedQuestionsArray.js');
var ApartmateUser = require('./ApartmateUser.js');
var GatheredListings = require('./GatheredListings.js');

var async = require('async');

module.exports = {

    // getAllQuestions: function(callback)
    // {
    //     console.log("CreatedQuestionsArray.getAllQuestions");
    //     CreatedQuestionsArray.find({})
    //     .exec(

    //         function (err, questions) {

    //             if (err || !questions) {
    //                 callback("No questions found", null);
    //             } else {
    //                 console.log(questions);
    //                 callback(null, questions);
    //                 // callback(null, "Test");

    //             }

    //         }
    //     );
    // },
    
    addCreatedQuestion: function(createdQuestion, callback)
    {
        console.log("QuestionsArray.addQuestionById");

        console.log(createdQuestion);

        // callback(null, createdQuestion);
        var newCreatedQuestion = CreatedQuestionsArray();

        newCreatedQuestion.question = createdQuestion.question;
        newCreatedQuestion.userId = createdQuestion.apartmate._id;
        newCreatedQuestion.email = createdQuestion.apartmate.emailAddress;

        newCreatedQuestion.option.push({"_id": 0, "order": 0, "name": createdQuestion.option1 });
        newCreatedQuestion.option.push({"_id": 1, "order": 1, "name": createdQuestion.option2 });

        if(createdQuestion.option3 !== '')
            newCreatedQuestion.option.push({"_id": 2, "order": 2, "name": createdQuestion.option3 });

        if(createdQuestion.option4 !== '')
            newCreatedQuestion.option.push({"_id": 3, "order": 3, "name": createdQuestion.option4 });



        newCreatedQuestion.save(function(err, createdQuestion)
        {
            if (err)
            {
                console.log('Error with adding new property listing: ' + err);
                callback('Property Listing Creation failed', null);
            } else
            {
                console.log('New Property Listing was created');
                callback(null, createdQuestion);
            }
        });


        // var fn1 = function(done){
            
        //     CreatedQuestionsArray.update({'email': email}, {$push: { questionsResults: result }}, {multi: true}, function (err, propertiesSaved) {
                
        //         if (err){
        //             console.log('err: ' + err);
        //         } else
        //             done(null, propertiesSaved);

        //     });

        // };

        // var fn2 = function(propertySaved, done){

        //     ApartmateUser.findOne({ 'emailAddress': email}, function (err, existingUser) {
                
        //         if (err || !existingUser) {
        //             console.log('err: ' + err);
        //         } else {
        //             console.log('existingUser exists here ');
        //             console.log(existingUser);
        //             existingUser.questionsResults.push(result);
        //             if(completed) 
        //                 existingUser.questionsAnswered = completed;

        //             existingUser.save(function(err, userSaved) {
        //                 if(err)
        //                     callback('Could not save Apartmate', null);

        //                 done(null, propertySaved, userSaved);

        //             });
        //         }

        //     });

        // };


        // async.waterfall([fn1, fn2], function(err, propertySaved, userSaved){
        //     console.log(propertySaved);
        //     console.log(userSaved);
        //     callback(null, propertySaved, userSaved);
        // });
    },
};