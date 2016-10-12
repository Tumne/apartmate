angular.module('angular-client-side-auth')
.controller('AddSharedSearchProfileCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'ApartmateProfile', function($rootScope, $scope, $location, $window, Auth, ApartmateProfile) {

    $scope.property = new Object();
    $scope.apartmate = new Object();
    $scope.property.utilities = new Object();
    $scope.property.features = new Object();

    $scope.test = 'Working';
    $scope.loading = true;

      $scope.status = {
        isopen: false
      };

    $scope.today = function() {
        $scope.property.dt = new Date();
      };
      $scope.today();

    $scope.clear = function () {
        $scope.property.dt = null;
    };

      // // Disable weekend selection
      // $scope.disabled = function(date, mode) {
      //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      // };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
      
    try {

        $scope.apartmate.selectedNumberOfSeekers = "1 person";
        $scope.apartmate.selectedGroupType = 'A couple';
        $scope.apartmate.selectedAgeGroup = "18-22";
        $scope.apartmate.selectedLifestyle = "Student";
    } catch(err) {

            $rootScope.error = err.message;
    }
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.onNumberOfSeekersSelect = function(numberOfSeekers)
    {
        $scope.apartmate.selectedNumberOfSeekers = numberOfSeekers;
    };

    $scope.onGroupTypeSelect = function(groupType)
    {
        $scope.apartmate.selectedGroupType = groupType;
    };

    $scope.onLifestyleSelect = function(lifestyleSelected)
    {
        $scope.apartmate.selectedLifestyle = lifestyleSelected;
    };

    $scope.onAgeGroupSelect = function(ageGroupSelected)
    {
        $scope.apartmate.selectedAgeGroup = ageGroupSelected;
    };

    $scope.addSharedSearchProfilePart1 = function()
    {
        try {
            
            $scope.apartmate.emailAddress = $rootScope.user.emailAddress;
            console.log('Email: ' + $scope.apartmate.emailAddress);
            ApartmateProfile.addSharedSearchProfilePart1({
                apartmate: $scope.apartmate

            },
            function(res) {
                $location.path('/apartmate_part2');
                $rootScope.apartmate = res.apartmate;
                $rootScope.success = "We've created the first part of the listing for " + res.property._id;
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };

    $scope.updateAndFinishSharedSearchProfileById = function()
    {
        try {
            console.log('rootScope apartmate id: ' +  $rootScope.apartmate._id);
            console.log('poster name: ' + $scope.apartmate.displayName);
            $scope.apartmate._id = $rootScope.apartmate._id;

            ApartmateProfile.updateAndFinishApartmateProfileById({
                apartmate: $scope.apartmate
            },
            function(res) {

                $location.path('/');
                $rootScope.success = "We've finished creating the listing for " + res.apartmate._id;
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };
}]);

