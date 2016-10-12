
angular.module('angular-client-side-auth')
.controller('AdviceCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$stateParams', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $stateParams) {

    
    // TODO: case for each category for link refresh

    $scope.resetRentersIndex = function(){
      $rootScope.indexRenters = 0;
      $rootScope.fbTitle = $rootScope.articlesRenters[$rootScope.indexRenters].title;
      $rootScope.fbDesc = $rootScope.articlesRenters[$rootScope.indexRenters].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesRenters[$rootScope.indexRenters].thumbnail;
    };

    $scope.resetRoommatesIndex = function(){
      $rootScope.indexRoommates = 0;
      $rootScope.fbTitle = $rootScope.articlesRoommates[$rootScope.indexRoommates].title;
      $rootScope.fbDesc = $rootScope.articlesRoommates[$rootScope.indexRoommates].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesRoommates[$rootScope.indexRoommates].thumbnail;
    };

    $scope.resetLandlordsIndex = function(){
      $rootScope.indexLandlords = 0;
      $rootScope.fbTitle = $rootScope.articlesLandlords[$rootScope.indexLandlords].title;
      $rootScope.fbDesc = $rootScope.articlesLandlords[$rootScope.indexLandlords].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesLandlords[$rootScope.indexLandlords].thumbnail;
    };

}]);


