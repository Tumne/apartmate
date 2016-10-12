
angular.module('angular-client-side-auth')
.controller('AdviceLandlordsCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$sce', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $sce) {

    $scope.changeIndex = function(_index) {
      $rootScope.indexLandlords = _index;
      $rootScope.fbTitle = $rootScope.articlesLandlords[$rootScope.indexLandlords].title;
      $rootScope.fbDesc = $rootScope.articlesLandlords[$rootScope.indexLandlords].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesLandlords[$rootScope.indexLandlords].thumbnail;
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);


