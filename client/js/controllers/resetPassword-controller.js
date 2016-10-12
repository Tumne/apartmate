angular.module('angular-client-side-auth')
.controller('ResetPasswordCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.resetPassword = function() {
        Auth.resetPassword({
                emailAddress: $scope.emailAddress,
                password: $scope.password
            },
            function(res) {
                console.log('message: ' + JSON.stringify(res));
                 $rootScope.success = "Found it, we sent the password to your email address";

                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = "Failed to retrieve password";
            });
    };

}]);