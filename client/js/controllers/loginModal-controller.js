angular.module('angular-client-side-auth')
.controller('LoginModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'status', 'Auth', function($rootScope, $scope, $location, $window, $modalInstance, status, Auth) {
    $scope.verifyEmail = null;
    $scope.account = status;
    $scope.rememberme = true;
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;
    $scope.customAlert = false;
    $scope.emailRecieve = false;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };


    $scope.forgotPassword = function() {
      $scope.account = 'forgot';
    }
    $scope.createAccount = function () {
        $scope.account = 'new';
    }

    $scope.existingAccount = function () {
        $scope.account = 'created';
    }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.rememberme = true;

  $scope.alerts = [];
  if($rootScope.nextTask == "viewPropertyListing"){
    $scope.alerts.push({type: 'info', msg: "Login to view your property listing."});
  }

  $scope.tries = 0;

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.resetMyPassword = function()
  {
      console.log($scope.emailAddress);
      Auth.forgotPassword({
          emailAddress: $scope.emailAddress
      },
      function(res) {
          console.log('message: ' + res);

          $scope.alerts = new Array();
          $scope.alerts.push({type: 'success', msg: "Success! We've sent you an email with your password. If it doesn't arrive soon, check your spam folder. "});
          //$rootScope.success = "Found it, sent it. Check your email for the password.";
          //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
      },
      function(err) {
          //$rootScope.error = err.message;
          console.log('err: ', err.message);
          $scope.alerts = new Array();
          $scope.alerts.push({type: 'danger', msg: err.message});
      });
  }
  
  $scope.login = function() {
        console.log('$scope.emailAddress: ' + $scope.emailAddress);
        console.log('$scope.password: ' + $scope.password);

        $scope.rememberme = true;
        Auth.login({
                emailAddress: $scope.emailAddress.toLowerCase(),
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                console.log(res.user);
                if(res.user.username == "") 
                  res.user.username = res.user.emailAddress;

                $rootScope.user = res.user;
                console.log('$rootScope.user.emailAddress: ' + $rootScope.user.emailAddress);
                console.log('$rootScope.user.apartmateListingCreated: ' + $rootScope.user.apartmateListingCreated);
                $location.path('/search');
                $modalInstance.close($rootScope.user);
                
            },
            function(err) {
                console.log('Login err: ' + err);
                $rootScope.error = err;
                $scope.tries++;
                $scope.alerts = new Array();

                if(err == "Sorry, we don't recognize that email address. Please try again or create an account."){
                  $scope.customAlert = true;
                } else {
                  $scope.customAlert = false;
                }
                $scope.alerts.push({type: 'danger', msg: err});
            });
    };

    $scope.clickEmailRecieve = function() {
      $scope.emailRecieve = !$scope.emailRecieve;
    };
    
    $scope.signup = function() {

        Auth.signup({
                emailAddress: $scope.emailAddress.toLowerCase(),
                password: $scope.password,
                role: $scope.role,
                emailRecieve: $scope.emailRecieve
            },
            function(res) {
                // $rootScope.user = res.user;
                $scope.verifyEmail = res.user.emailAddress;
                $scope.account = 'verified';
                $location.path('/search');
                // $modalInstance.close($rootScope.user);
            },
            function(err) {
                console.log('err: ' + err);
                $scope.alerts = new Array();
                $scope.alerts.push({type: 'danger', msg: err});
                //$rootScope.error = err;
            });
    };

    $scope.openSignUp = function() {
        $scope.alerts = new Array();
        $scope.account = 'new';
    }

    $scope.loginOauth = function(provider) {
        console.log('loginOauth - LoginModalCtrl');
        // Auth.loginWithFacebook({
        //   provider: 'facebook'
        // },
        // function(res) {
        //   console.log('we made it happen');

        // },
        // function(err) {
        //   console.log('err: ' + err);
        // });
        console.log($window.location);
        $window.location.href = '/auth/' + provider;
        //$scope.alerts.push({type: 'danger', msg: "Facebook login coming soon."});
    };
}]);

