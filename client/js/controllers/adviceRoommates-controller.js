
angular.module('angular-client-side-auth')
.controller('AdviceRoommatesCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$sce', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $sce) {
    
    $scope.changeIndex = function(_index) {
      $rootScope.indexRoommates = _index;
      $rootScope.fbTitle = $rootScope.articlesRoommates[$rootScope.indexRoommates].title;
      $rootScope.fbDesc = $rootScope.articlesRoommates[$rootScope.indexRoommates].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesRoommates[$rootScope.indexRoommates].thumbnail;
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);


