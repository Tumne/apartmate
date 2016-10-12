angular.module('angular-client-side-auth')
.controller('AddApartmateProfileCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'ApartmateProfile', function($rootScope, $scope, $location, $window, Auth, ApartmateProfile) {

    $scope.property = new Object();
    $scope.apartmate = new Object();
    $scope.profileCreated = false;
    $scope.onlyNumbers = /^\d+$/;

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

    $scope.verifyLinkedIn = function(){
      console.log('verifyLinkedIn - function');
      $rootScope.user.firstName = $scope.apartmate.firstName;
      console.log('verifyLinkedIn - ' + $rootScope.user.firstName);
      try {
            $scope.profileCreated = true;
            $scope.apartmate.emailAddress = $rootScope.user.emailAddress;
            $scope.apartmate.selectedGender = $scope.apartmate.selectedGender.toLowerCase();
            $scope.apartmate.phoneNumber = $scope.apartmate.phone;

            if (!$scope.apartmate.maxRent || $scope.apartmate.maxRent === '')
              $scope.apartmate.maxRent = 0;

            ApartmateProfile.addApartmateProfilePart1({
                apartmate: $scope.apartmate

            },
            function(res) {
                
                $rootScope.apartmate = res.apartmate;
                $scope.apartmate = res.apartmate;

                $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                $window.location.href = '/auth/linkedin';


                //$rootScope.success = "We've created the first part of the listing for " + res.apartmate._id;
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


    $scope.saved = new Object();

  

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

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    $scope.existingProfileImages = new Array();

    $scope.getApartmateDetail = function()
    {   
        console.log('getApartmateDetail ');
        try {
            console.log('$rootScope.user._id: ' + $rootScope.user.emailAddress);
            ApartmateProfile.getApartmateListing({
                emailAddress: $rootScope.user.emailAddress

            },
            function(res) {
                console.log('id: ' + res.apartmate._id);
                $rootScope.apartmate = res.apartmate;
                $scope.apartmate = res.apartmate;
                console.log($scope.apartmate);
                $scope.apartmate.facebookVerified = false;
                $scope.apartmate.linkedInVerified = false;


                for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
                {
                  var url = $scope.apartmate.addedProfileImages[i].url;
                  $scope.existingProfileImages.push(url);
                }

                if ($scope.saved.selectedGender)
                {
                  $scope.apartmate.selectedGender = $scope.saved.selectedGender; 
                } else if ($scope.apartmate.selectedGender)
                {
                  $scope.apartmate.selectedGender = capitalizeFirstLetter($scope.apartmate.selectedGender);
                } 

                if ($scope.saved.selectedAgeGroup)
                {
                  $scope.apartmate.selectedAgeGroup = $scope.saved.selectedAgeGroup;
                } else if ($scope.apartmate.ageGroup)
                {
                  $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                }

                if ($scope.saved.selectedLifestyle)
                {
                  $scope.apartmate.selectedLifestyle = $scope.saved.selectedLifestyle
                } else if ($scope.apartmate.lifestyle)
                {
                  $scope.apartmate.selectedLifestyle = $scope.apartmate.lifestyle;
                } 
                
                if ($scope.apartmate.maxRent)
                  $scope.apartmate.maxRent = $scope.apartmate.maxRent;

                $scope.apartmate.emailAddress = $scope.user.emailAddress;

                if ($scope.apartmate.phoneNumber)
                  $scope.apartmate.phone = $scope.apartmate.phoneNumber;

                console.log('$scope.apartmate.phone: ' + $scope.apartmate.phone);
                console.log('$scope.apartmate.phoneNumber: ' + $scope.apartmate.phoneNumber);
                if ($scope.apartmate.provider.length > 0)
                {
                    console.log('line 8718');
                    for (var p = 0; p < $scope.apartmate.provider.length; p++)
                    {
                      
                        if ($scope.apartmate.provider[p].name === 'facebook')
                            $scope.apartmate.facebookVerified = true;

                        if ($scope.apartmate.provider[p].name === 'linkedin')
                           $scope.apartmate.linkedInVerified = true;
                    }
                
                } else {
                  console.log('provider is 0')
                }
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                console.log('LIne 8803 err: ' + err);
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            console.log('err: ' + err);
            $rootScope.error = err.message;
        }
    };
      
    try {
        console.log('$scope.apartmate.provider');
        $scope.apartmate.selectedGender = "Female";
        $scope.apartmate.selectedAgeGroup = "18-22";
        $scope.apartmate.selectedLifestyle = "Student";
        $scope.apartmate.emailAddress = $scope.user.emailAddress;


        if ($scope.profileCreated === false)
         $scope.getApartmateDetail();

        
    } catch(err) {
        console.log('err: ' + err);
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

    $scope.onGenderSelect = function(genderSelected)
    {
        $scope.apartmate.selectedGender = genderSelected;
        $scope.saved.selectedGender = genderSelected;
    };

    $scope.onLifestyleSelect = function(lifestyleSelected)
    {
        $scope.apartmate.selectedLifestyle = lifestyleSelected;
        $scope.saved.selectedLifestyle = lifestyleSelected;
    };

    $scope.onAgeGroupSelect = function(ageGroupSelected)
    {
        $scope.apartmate.selectedAgeGroup = ageGroupSelected;
        $scope.saved.selectedAgeGroup = ageGroupSelected;
    };

    $scope.addApartmateProfilePart1 = function()
    {
        console.log('addApartmateProfilePart1');
        try {
            $scope.profileCreated = true;
            $scope.apartmate.emailAddress = $rootScope.user.emailAddress;
            $scope.apartmate.selectedGender = $scope.apartmate.selectedGender.toLowerCase();

            if (!$scope.apartmate.maxRent || $scope.apartmate.maxRent === '')
              $scope.apartmate.maxRent = 0;

            ApartmateProfile.addApartmateProfilePart1({
                apartmate: $scope.apartmate

            },
            function(res) {
                $location.path('/roommateProfile_part2');
                $rootScope.apartmate = res.apartmate;
                $rootScope.success = "We've created the first part of the listing for " + res.apartmate._id;
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

    $scope.publishProfilePictures = function()
    {
        console.log('publishProfilePictures');
        ApartmateProfile.publishProfilePictures({
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res.profileSaved);
                $rootScope.user = res.profileSaved;
                
                $scope.$emit('RoommateProfileCreatedEmit', {});
                $location.path('/my_profile');
                $scope.$emit('MatchmakingQuestionsEmit', {});

                $rootScope.success = "We've published pictures ";
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
                console.log(err.message);
        });
    };

    $scope.deleteProfilePictures = function(_file)
    {
        console.log('file.cancel()');
        _file.cancel();
        var name = _file.getFileName();
       // _file.name = name;
        console.log('name:  ' + name);
        $scope.apartmate.filename = name;

        try {
            ApartmateProfile.removeProfilePictures({
                apartmate: $scope.apartmate
            },
            function(res) {

                //$location.path('/part3');
                $rootScope.success = "We've removed pictures ";
                console.log('removed');
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                console.log('err: '+ err);
                $rootScope.error = err.message;
            });
        } catch(err) {
            $rootScope.error = err.message;
        }
    }

    $scope.updateAndFinishApartmateProfileById = function()
    {
        try {
            console.log('rootScope apartmate id: ' +  $rootScope.apartmate._id);
            console.log('poster name: ' + $scope.apartmate.displayName);
            $scope.apartmate._id = $rootScope.apartmate._id;

            ApartmateProfile.updateAndFinishApartmateProfileById({
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res.apartmate);
                $rootScope.user = res.apartmate;

                // $scope.$emit('RoommateProfileCreatedEmit', {});
                $rootScope.success = "We've finished creating the listing for " + res.apartmate._id;

                $scope.publishProfilePictures();
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

    $scope.removeExistingProfilePictures = function(_file)
    {
        try {
            
            $scope.apartmate.filename = _file;
            console.log('$scope.apartmate._id: ' + $scope.apartmate._id);

            for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
            {
              if ($scope.apartmate.addedProfileImages[i] === _file)
              {
                $scope.apartmate.addedProfileImages.splice(i, 1);
                $scope.existingImages.splice(i, 1);
                console.log('removing it locally');
              }
            }

            ApartmateProfile.removeExistingProfilePictures({
                apartmate: $scope.apartmate
            },
            function(res) {
                $scope.apartmate = res.apartmate;
                $rootScope.success = "We've removed existing pictures ";
                console.log('removed'); 
                $scope.existingImages = new Array();
                for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
                {
                  var url = $scope.apartmate.addedProfileImages[i].url;
                  $scope.existingImages.push(url);
                }
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