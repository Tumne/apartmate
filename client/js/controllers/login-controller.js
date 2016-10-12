angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                emailAddress: $scope.emailAddress.toLowerCase(),
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
                $rootScope.user = res.user;

                console.log('user email: ' + $rootScope.user.emailAddress);
                console.log('user id: ' + $rootScope.user._id);
            },
            function(err) {
                console.log('err: ' + err);
                $rootScope.error = err;
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

