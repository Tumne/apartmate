//'use strict';

angular.module('angular-client-side-auth')
.factory('WholePropertySchema', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/json/wholeProperty.json').success(success).error(error);
        }
    };
});