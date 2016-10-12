angular.module('angular-client-side-auth')
.controller('SignupCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
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
}]);