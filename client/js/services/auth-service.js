//'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $rootScope, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { emailAddress: '', firstName: '', username: '', role: userRoles.public };
        $rootScope.currentUser = currentUser;
        $cookieStore.remove('user');

    console.log('$rootScope.currentUser firstName: ' + $rootScope.currentUser.firstName);
    console.log($rootScope.currentUser);

    function changeUser(user) {
        console.log(user);
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            //console.log('trying to authorize with ' + accessLevel.bitMask + ' and ' + role.bitMask);
            if(role === undefined) {
                role = currentUser.role;
            }
            //console.log('after authorize check ' + accessLevel.bitMask + ' and ' + role.bitMask);
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        loginWithFacebook: function(user, success, error) {
            console.log('loginWithFacebook - services ');
            //user.username = user.emailAddress;
            $http({
                url: '/auth/facebook',
                method: 'GET'
            }).success(function(user) {
                changeUser(user);
                success(user);

            }).error(error);
        },
        verifyLinkedIn: function(user, success, error) {
            console.log('verifyLinkedIn - services ');
            //user.username = user.emailAddress;
            $http({
                url: '/auth/linkedIn',
                method: 'GET'
            }).success(function(user) {
                changeUser(user);
                success(user);

            }).error(error);
        },
        signup: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/signup', user).success(function(user) {
                // changeUser(user);
                success(user);
            }).error(error);
        },
        login: function(user, success, error) {
            console.log(user);
            user.username = user.emailAddress;
            console.log(user);
            $http.post('/login', user).success(function(user){
                console.log(user);
                changeUser(user);
                success(user);
            }).error(error);
        },
        verify: function(user, success, error) {
            $http.post('/verify', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        forgotPassword: function(user, success, error) {
            user.username = user.emailAddress;
            console.log(user.username);
            $http.post('/forgotPassword', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        resetPassword: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/resetPassword', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        getPropertyListingsByUser: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/getPropertyListingsByUser', user).success(function(user){
                success(user);
            }).error(error);
        },
        getPropertyListingById: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/getPropertyListingById', user).success(function(user){
                success(user);
            }).error(error);
        },
        getPropertyById: function(id, success, error) {
            $http.post('/getPropertyById', id).success(function(property){
                success(property);
            }).error(error);
        },
        addToFavorites: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/addToFavorites', user).success(function(user){
                success(user);
            }).error(error);
        },
        getFavoriteProperties: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/getFavoriteProperties', user).success(function(user){
                success(user);
            }).error(error);
        },
        removeFromFavorites: function(user, success, error) {
            user.username = user.emailAddress;
            $http.post('/removeFromFavorites', user).success(function(user){
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    emailAddress: '',
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});