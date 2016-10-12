
angular.module('angular-client-side-auth')
.controller('AdviceRentersCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$sce', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $sce) {

    $scope.changeIndex = function(_index) {
      $rootScope.indexRenters = _index;
      $rootScope.fbTitle = $rootScope.articlesRenters[$rootScope.indexRenters].title;
      $rootScope.fbDesc = $rootScope.articlesRenters[$rootScope.indexRenters].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesRenters[$rootScope.indexRenters].thumbnail;
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);


