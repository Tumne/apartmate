//'use strict';

angular.module('angular-client-side-auth')
.factory('ApartmateProfile', function($http, $rootScope, $cookieStore){

    // var accessLevels = routingConfig.accessLevels
    //     , userRoles = routingConfig.userRoles
    //     , currentUser = $cookieStore.get('user') || { emailAddress: '', firstName: '', username: '', role: userRoles.public };
    //     $rootScope.currentUser = currentUser;
    //     $cookieStore.remove('user');

    // console.log('$rootScope.currentUser firstName: ' + $rootScope.currentUser.firstName);
    // console.log($rootScope.currentUser);

    // function changeUser(user) {
    //     console.log("TEST");
    //     console.log(user);
    //     angular.extend(currentUser, user);
    // }

    return {
        addApartmateProfilePart1: function(request, success, error) 
        {
            console.log('addApartmateProfilePart1');
            $http.post('/addApartmateProfilePart1', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        updateApartmateProfilePart1: function(request, success, error) 
        {
            
            $http.post('/updateApartmateProfilePart1', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        updateActiveProfile: function(request, success, error) 
        {
            
            $http.post('/updateActiveProfile', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        removeProfilePictures: function(request, success, error) 
        {
            console.log('removeProfilePictures');
            $http.post('/profile/api/remove', request).success(function(res) {
                success(res);
            }).error(error);
        },
        removeExistingProfilePictures: function(request, success, error) 
        {
            console.log('removeExistingProfilePictures');
            $http.post('/updateApartmatePictures', request).success(function(res) {
                success(res);
            }).error(error);
        },
        publishProfilePictures: function(request, success, error) 
        {
            console.log('publishProfilePictures');
            $http.post('/profile/api/publishProfile', request).success(function(res) {
                success(res);
            }).error(error);
        },
        updateAndFinishApartmateProfileById: function(request, success, error) 
        {
            
            $http.post('/updateAndFinishApartmateProfileById', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },

        addSharedSearchProfilePart1: function(request, success, error) 
        {
            
            $http.post('/addSharedSearchProfilePart1', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        updateAndFinishSharedSearchProfileById: function(request, success, error) 
        {
            
            $http.post('/updateAndFinishSharedSearchProfileById', request).success(function(res) 
            {
                success(res);
            }).error(error);
        },
        getApartmateProfile: function(request, success, error) 
        {   
            $http.post('/getApartmateProfile', request).success(function(res) {
                success(res);
            }).error(error);
        },        
        getApartmateListings: function(request, success, error) 
        {   
            $http.post('/getApartmateListings', request).success(function(res) {
                success(res);
            }).error(error);
        },
        getApartmateListing: function(request, success, error) 
        {   
            $http.post('/getApartmateListing', request).success(function(res) {
                success(res);
            }).error(error);
        },

        
        getApartmateListingsByFilter: function(request, success, error) 
        {   
            $http.post('/getApartmateListingsByFilter', request).success(function(res) {
                success(res);
            }).error(error);
        },

        updateFBBoost: function(request, success, error) 
        {   
            $http.post('/updateFBBoost', request).success(function(res) {
                success(res);
            }).error(error);
        },
        dismissFBModal: function(request, success, error) 
        {   
            $http.post('/dismissFBModal', request).success(function(res) {
                success(res);
            }).error(error);
        }
                 
    };
});