angular.module('angular-client-side-auth')
.controller('EditRoommateCtrl',
['$rootScope', '$scope', '$location', '$window', 'ApartmateProfile', 'Auth', function($rootScope, $scope, $location, $window, ApartmateProfile, Auth) {
    $scope.existingImages = new Array();

    $scope.verifyLinkedIn = function(){

      $window.location.href = '/auth/linkedin' ;
    };
  

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    $scope.getApartmateDetail = function()
    {
        try {

            console.log('getApartmateDetail user emailAddress: ' + Auth.user.emailAddress);
            $scope.apartmateEmailAddress = $rootScope.user.emailAddress;
            ApartmateProfile.getApartmateListing({
                emailAddress: Auth.user.emailAddress

            },
            function(res) {
                console.log('id: ' + res.apartmate.firstName);
                // console.log(res.apartmate);
                
                $scope.apartmate = res.apartmate;
                //$scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                $scope.apartmate.gender = capitalizeFirstLetter($scope.apartmate.selectedGender);
                $scope.apartmate.selectedLifestyle = $scope.apartmate.lifestyle;
                $scope.apartmate.phone = $scope.apartmate.phoneNumber;
                $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                $scope.apartmate.facebookVerified = false;
                $scope.apartmate.linkedInVerified = false;


                for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
                {
                  var url = $scope.apartmate.addedProfileImages[i].url;
                  $scope.existingImages.push(url);
                }

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
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };


    $scope.getApartmateDetail();

    $scope.loggedIn = true;

    $scope.$on('loginEventBroadcast', function(event, args) 
    {
      console.log('Logged in: ' + args.user.emailAddress);
      $scope.loggedIn = true;
      $scope.apartmateId = args.user.id;
      console.log('args.user.id: ' + args.user.id);
    });

    $scope.onlyNumbers = /^\d+$/;
  

    $scope.status = {
      isopen: false
    };

   
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

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
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
    
    $scope.updateApartmateListingPart1 = function()
    {
        try {
            
            //console.log('User Id: ' + $scope.user.id);
            // console.log('Street address: ' + $scope.property.streetAddress);
            // console.log('Property Type: ' + $scope.property.propertyTypeSelected);
            // console.log('basementApartment: ' + $scope.property.isBasementApartment);
            // console.log('bedrooms: ' + $scope.property.selectedBathrooms);
            // console.log('bathrooms: ' + $scope.property.selectedBedrooms);
            // console.log('postalCode: ' + $scope.property.postalCode);
            // console.log('availabilityDate: ' + $scope.property.dt);
            // console.log('leaseTermsAvailable: ' + $scope.property.selectedLeaseTerm);
            // console.log('rentAmount: ' + $scope.property.rentAmount);
            // console.log('electricityIncluded: ' + $scope.property.utilities.electricityIncluded);
            // console.log('utilities: ' + $scope.property.utilities);
            // console.log('petsWelcome: ' + $scope.property.selectedPets);
            // console.log('featuresIncluded: ' + $scope.property.features);
            console.log('user ID: ' + $scope.apartmate._id);
            console.log('$scope.apartmate.gender: ' + $scope.apartmate.selectedGender);


            //$scope.apartmate.gender = $scope.apartmate.gender.toLowerCase();
            if (!$scope.apartmate.maxRent || $scope.apartmate.maxRent === '')
              $scope.apartmate.maxRent = 0;
            
            ApartmateProfile.addApartmateProfilePart1({
                apartmate: $scope.apartmate

            },
            function(res) {
                console.log('res');
                $rootScope.apartmate = res.apartmate;
                $location.path('/edit_roommate_part2');
                $rootScope.success = "We've created the first part of the listing for " + res.apartmate._id;
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                console.log('error: ' + err);
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            console.log('err: ' + err);
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
                console.log(res);
                if(res.success != 0){
                    $rootScope.user = res.profileSaved;
                    $scope.$emit('RoommateProfileCreatedEmit', {});
                    $location.path('/my_profile');
                    $rootScope.success = "We've published pictures ";    
                } else {
                    $rootScope.user = $scope.apartmate;
                    $scope.$emit('RoommateProfileCreatedEmit', {});
                    $location.path('/my_profile');                    
                }
                $rootScope.success = "We've published pictures ";
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
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
        console.log("TEST!");
        console.log($scope.user);
        console.log($scope.apartmate);

        try {
           // console.log('rootScope apartmate id: ' +  $rootScope.apartmate._id);
            //console.log('poster name: ' + $scope.apartmate.displayName);
            $scope.apartmate._id = $rootScope.apartmate._id;

            ApartmateProfile.updateAndFinishApartmateProfileById({
                apartmate: $scope.apartmate
            },
            function(res) {
                // if(res.addedProfileImages.length > 0){
                //     $scope.apartmate = res.apartmate;
                // } else {
                //     $scope.user.src = "/img/profile/placeholder.png";
                //     $scope.apartmate = res.apartmate;
                // }

                console.log(res);
                
                // $location.path('/my_profile/');
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

    $scope.onGenderSelect = function(genderSelected)
    {
        $scope.apartmate.selectedGender = genderSelected.toLowerCase();
        $scope.apartmate.gender = $scope.apartmate.selectedGender;
    };

    $scope.onLifestyleSelect = function(lifestyleSelected)
    {
        $scope.apartmate.selectedLifestyle = lifestyleSelected;
    };

    $scope.onAgeGroupSelect = function(ageGroupSelected)
    {
        $scope.apartmate.ageGroup = ageGroupSelected;
    };

}]);


