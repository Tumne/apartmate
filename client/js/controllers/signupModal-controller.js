angular.module('angular-client-side-auth')
.controller('SignupModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'items', 'Auth', function($rootScope, $scope, $location, $window, $modalInstance, items, Auth) {

    $scope.rememberme = true;

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.rememberme = true;    
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.signup = function() {
        Auth.signup({
                emailAddress: $scope.emailAddress,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                //$rootScope.path('/home');
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);