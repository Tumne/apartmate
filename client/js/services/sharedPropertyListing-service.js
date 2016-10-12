//'use strict';

angular.module('angular-client-side-auth')
.factory('SharedPropertyListing', function($http){

    return {
        addSharedPropertyListingPart1: function(request, success, error) 
        {
            
            $http.post('/addSharedPropertyListing', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        updateSharedPropertyPart2ById: function(request, success, error) 
        {
            
            $http.post('/updateSharedPropertyPart2ById', request).success(function(res) {
                success(res);
            }).error(error);
        },
        removeExistingPropertyPictures: function(request, success, error) 
        {
            console.log('removeExistingPropertyPictures');
            $http.post('/updatePropertyPictures', request).success(function(res) {
                success(res);
            }).error(error);
        },
        removePropertyPictures: function(request, success, error) 
        {
            console.log('removePropertyPictures');
            $http.post('/properties/api/remove', request).success(function(res) {
                success(res);
            }).error(error);
        },
        publishPropertyPictures: function(request, success, error) 
        {
            console.log('publishPropertyPictures');
            $http.post('/properties/api/publish', request).success(function(res) {
                console.log('done');
            }).error(console.log('failed'));
        },
        removeProfilePictures: function(request, success, error) 
        {
            console.log('removeProfilePictures');
            $http.post('/profile/api/remove', request).success(function(res) {
                success(res);
            }).error(error);
        },
        publishProfilePictures: function(request, success, error) 
        {
            console.log('publishProfilePictures');
            $http.post('/profile/api/publish', request).success(function(res) {
                success(res);
            }).error(error);
        },
        updateAndFinishSharedPropertyById: function(request, success, error) 
        {   
            $http.post('/updateAndFinishSharedPropertyById', request).success(function(res) {
                success(res);
            }).error(error);
        },
        editSharedPropertyListingPart1: function(request, success, error) 
        {
            
            $http.post('/editSharedPropertyListing', request).success(function(res) 
            {
                success(res);
            }).error(error);
        }
    };
});
