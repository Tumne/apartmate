
angular.module('angular-client-side-auth')
.controller('MobileAdviceCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$stateParams', '$sce', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $stateParams, $sce) {

    console.log($location.path().split('/')[2]);
    $scope.adviceCategory = $location.path().split('/')[2];
    $scope.backdrop = true;
    // TODO: case for each category for link refresh
    
    function toggleBackdrop () {
      if($("#menu").is(":visible"))
        $scope.backdrop = true;
      else
        $scope.backdrop = false;
    }

    $scope.resetRentersIndex = function(){
      // $rootScope.indexRenters = 0;
      if($scope.adviceCategory == 'renters' || (!$("#menu").is(":visible") && $scope.adviceCategory != 'renters'))
        $("#menu").toggle();
      toggleBackdrop();
      $scope.adviceCategory = 'renters';

    };

    $scope.resetRoommatesIndex = function(){
      // $rootScope.indexRoommates = 0;
      console.log($("#menu").is(":visible"));
      if($scope.adviceCategory == 'roommates' || (!$("#menu").is(":visible") && $scope.adviceCategory != 'roommates'))
        $("#menu").toggle();
      toggleBackdrop();
      $scope.adviceCategory = 'roommates';
    };

    $scope.resetLandlordsIndex = function(){
      // $rootScope.indexLandlords = 0;
      if($scope.adviceCategory == 'landlords' || (!$("#menu").is(":visible") && $scope.adviceCategory != 'landlords'))
        $("#menu").toggle();
      toggleBackdrop();
      $scope.adviceCategory = 'landlords';
    };

    $scope.changeIndex = function(_index) {
      switch($scope.adviceCategory){
        case 'renters':
          $rootScope.indexRenters = _index;
          break;
        case 'roommates':
          $rootScope.indexRoommates = _index;
          break;
        case 'landlords':
          $rootScope.indexLandlords = _index;
          break;
      }
      $scope.backdrop = false;
      $("#menu").toggle();
    };

    $scope.closeBackdrop = function() {
      $scope.backdrop = false;
      $("#menu").toggle();
    };

    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
}]);


