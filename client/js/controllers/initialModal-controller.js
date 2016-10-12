angular.module('angular-client-side-auth')
.controller('InitialModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'status', 'Auth', function($rootScope, $scope, $location, $window, $modalInstance, status, Auth) {
  $scope.initialModal = status;
  console.log($scope.initialModal);
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.apartmentOffered = function () {
    $location.path('/addProperty');
    $scope.ok();
  };

  $scope.roomOffered = function () {
    $location.path('/shared_part1');
    $scope.ok();
  };

  $scope.roomWanted = function () {
    $location.path('/roommateProfile_part1');
    $scope.ok();
  };
}]);

