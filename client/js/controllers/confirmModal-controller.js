angular.module('angular-client-side-auth')
.controller('ConfirmModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'status', 'Auth', function($rootScope, $scope, $location, $window, $modalInstance, status, Auth) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.rememberme = true;

  $scope.alerts = [];
  $scope.tries = 0;

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  
}]);

