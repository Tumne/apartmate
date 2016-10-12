angular.module('angular-client-side-auth')
.controller('ForgotPasswordCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.forgotPassword = function() {
        Auth.forgotPassword({
                emailAddress: $scope.emailAddress
            },
            function(res) {
                console.log('message: ' + res);
                $rootScope.success = "Found it, we sent the password to your email address";
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
    };

}]);