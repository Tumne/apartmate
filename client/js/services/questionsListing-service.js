//'use strict';

angular.module('angular-client-side-auth')
.factory('QuestionsListing', function($http){

    return {
        getQuestions: function(request, success, error) 
        {
            $http.post('/getQuestions', request).success(function(res)
            {
                success(res);
            }).error(error);
        },
        addQuestionById: function(request, success, error) 
        {
            $http.post('/addQuestionById', request).success(function(res)
            {
                success(res);
            }).error(error);
        },
        addCreatedQuestion: function(request, success, error) 
        {
            $http.post('/addCreatedQuestion', request).success(function(res)
            {
                success(res);
            }).error(error);
        }
    };
});