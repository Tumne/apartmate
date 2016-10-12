//'use strict';

angular.module('angular-client-side-auth')
.factory('PropertyListing', function($http){

    return {
        addWholePropertyListingPart1: function(request, success, error) 
        {
            
            $http.post('/addPropertyListing', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        getLastKnownProperty: function(request, success, error) 
        {
            $http.post('/getLastKnownProperty', request).success(function(res) {
                success(res);
            }).error(error);
        }, 
        updatePropertyPart2ById: function(request, success, error) 
        {
            
            $http.post('/updatePropertyPart2ById', request).success(function(res) {
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
                console.log(res);
            }).error(console.log('failed'));
        },
        updateAndFinishPropertyById: function(request, success, error) 
        {   
            $http.post('/updateAndFinishPropertyById', request).success(function(res) {
                success(res);
            }).error(error);
        },
        updateWholePropertyListingPart1: function(request, success, error) 
        {
            
            $http.post('/editPropertyListing', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        getPropertyListings: function(request, success, error) 
        {   
            $http.post('/getPropertyListings', request).success(function(res) {
                success(res);
            }).error(error);
        },
        deletePropertyListingById: function(request, success, error) 
        {   
            console.log(request);
            $http.delete('/deletePropertyListingById/' + request.id).success(function(res) {
                success(res);
            }).error(error);
        },
        getPropertyListingsByFilter: function(request, success, error) 
        {   
            $http.post('/getPropertyListingsByFilter', request).success(function(res) {
                success(res);
            }).error(error);
        },
        getPropertyListingsByFilterApartmate: function(request, success, error) 
        {   
            $http.post('/getPropertyListingsByFilterApartmate', request).success(function(res) {
                success(res);
            }).error(error);
        },
        getApartmateListings: function(request, success, error) 
        {   
            $http.post('/getApartmateListings', request).success(function(res) {
                success(res);
            }).error(error);
        },
        getApartmateListingsByFilter: function(request, success, error) 
        {   
            $http.post('/getApartmateListingsByFilter', request).success(function(res) {
                success(res);
            }).error(error);
        },
        updatePublishedPropertyListing: function(request, success, error) 
        {
            console.log("here");

            $http.post('/updatePublishedPropertyListing/' + request.id).success(function(res) 
            {
                success(res);
            }).error(error);
        }
    };
});