angular.module('angular-client-side-auth')
.controller('AddSharedPropertyCtrl',
['$rootScope', '$scope', '$location', '$window', 'WholePropertySchema', 'PropertyListing', 'SharedPropertyListing', 'ApartmateProfile', 'Auth', function($rootScope, $scope, $location, $window, WholePropertySchema, PropertyListing, SharedPropertyListing, ApartmateProfile, Auth) {

    $rootScope.seo = {
      title: "Apartmate | Add Property",
      description: "Add Property"
    };

    $scope.originalPropertiesArray = new Array();
    $scope.property = new Object();
    $scope.apartmate = new Object();

    $scope.loggedIn = false;
    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      console.log('User is logged in: ' + $rootScope.user.emailAddress);
      console.log('_id: ' + $rootScope.user._id);
      $scope.property.userId = $rootScope.user._id;
      $scope.loggedIn = true;
    } else {
        console.log('$rootScope.user: ' + $rootScope.user.emailAddress);
    }

    $scope.$on('loginEventBroadcast', function(event, args) 
    {
      console.log('Logged in: ' + args.user.emailAddress);
      $scope.loggedIn = true;
      $scope.property.userId = args.user.id;
      console.log('args.user.id: ' + args.user.id);
    });

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

    $scope.onlyNumbers = /^\d+$/;
    
    $scope.property.utilities = new Object();
    $scope.property.features = new Object();

    $scope.positions = [];
    $scope.positions.push({'name': "Tiny", 'minAge': 18, 'maxAge': 100});

    $scope.alerts = [];
    $scope.tries = 0;

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.status = {
      isopen: false
    };

    $scope.property.dt = null;

    $scope.today = function() {
      $scope.property.dt = null;
    };

    $scope.clear = function () {
        $scope.property.dt = null;
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
      
    try {

        $scope.property.propertyTypeSelected = "Low-rise apartment or condo";
        $scope.property.availableBedroomsSelected = "1 bedroom";
        $scope.property.selectedRoomSize = "Tiny";
        $scope.property.availableBathroomsSelected = "En suite";
        $scope.property.isBasementApartment = "No";
        $scope.property.selectedBathrooms = '1 bathroom';
        $scope.property.selectedBedrooms = '1 bedroom';
        $scope.property.selectedLeaseTerm = "One year";
        // $scope.property.selectedPets = "Yes";
        // $scope.property.selectedCouples = "Yes";
        // $scope.property.selectedLGBT = "Yes";
        $scope.property.selectedLgbtq  = "Yes (although no LGBTQ here yet)";
        $scope.property.landlordType = "Landlord";
        $scope.property.selectedAgeGroup = "18-22";
        $scope.property.roommatesSelected = '1 other person';
        $scope.property.selectedLifestyle = "Student";
        $scope.property.emailAddress = $rootScope.user.emailAddress;
    } catch(err) {
            $rootScope.error = err.message;
    }
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.existingProfileImages = new Array();

    try {

        ApartmateProfile.getApartmateListing({
            emailAddress: Auth.user.emailAddress
        },
        function(res) {
            console.log('id: ' + res.apartmate.firstName);
            // console.log(res.apartmate);
            $scope.apartmate  = res.apartmate;
            $scope.apartmate.name = $scope.apartmate.firstName;
            
            $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
            $scope.apartmate.selectedLifestyle = $scope.apartmate.lifestyle;
            
            for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
            {
              var url = $scope.apartmate.addedProfileImages[i].url;
              $scope.existingProfileImages.push(url);
            }

            console.log($scope.apartmate);
            console.log($scope.existingProfileImages);

            // [picture], name, selectedAgeGroup, selectedLifestyle 
            $rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
        },
        function(err) {
            $rootScope.error = err.message;
        });

    } catch (err){
        $rootScope.error = err.message;
    }

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

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.onPropertyTypeSelect = function(_propertyType)
    {
        $scope.property.propertyTypeSelected = _propertyType;
    };

    $scope.onAvailBedroomsSelect = function(_availBedrooms)
    {
        $scope.property.availableBedroomsSelected = _availBedrooms;
    };

    $scope.onAvailBathroomsSelect = function(_availBathrooms)
    {
        $scope.property.availableBathroomsSelected = _availBathrooms;
    };

    $scope.onBasementApartmentSelect = function(_is)
    {
        $scope.property.isBasementApartment = _is;
    };

    $scope.onBedroomSelect = function(bedroomsSelected)
    {
        $scope.property.selectedBedrooms = bedroomsSelected;
    };

    $scope.onBathroomSelect = function(bathroomsSelected)
    {
        $scope.property.selectedBathrooms = bathroomsSelected;
    };

    $scope.onLeaseTermSelect = function(leaseTermSelected)
    {
        $scope.property.selectedLeaseTerm = leaseTermSelected;
    };

    $scope.onCouplesSelect = function(couplesSelected)
    {
        $scope.property.selectedCouples = couplesSelected;
    };

    $scope.onLGBTSelect = function(lgbtSelected)
    {
        $scope.property.selectedLGBT = lgbtSelected;
    };


    $scope.onPetsSelect = function(petSelected)
    {
        $scope.property.selectedPets = petSelected;
    };

    $scope.onLandlordTypeSelect = function(landlordTypeSelected)
    {
        $scope.property.landlordType = landlordTypeSelected;
    };

    $scope.onNumOfRoommatesSelect = function(numOfRoommatesSelected)
    {
        $scope.property.roommatesSelected = numOfRoommatesSelected;
    };

    $scope.onRoomSizeSelect = function(roomSizeSelected)
    {
        $scope.property.selectedRoomSize = roomSizeSelected;
    };
    

    $scope.onGenderSelect = function(genderSelected)
    {
        $scope.apartmate.selectedGender = genderSelected;
        // $scope.saved.selectedGender = genderSelected;
    };

    $scope.onAgeGroupSelect = function(ageGroupSelected)
    {
        $scope.apartmate.selectedAgeGroup = ageGroupSelected;
    };

    $scope.onLifestyleSelect = function(lifestyleSelected)
    {
        $scope.apartmate.selectedLifestyle = lifestyleSelected;
    };
    
    $scope.addSharedPropertyListingPart1 = function()
    {
        try {
            
            //console.log('User Id: ' + $scope.user.id);
            console.log('Street address: ' + $scope.property.streetAddress);
            console.log('Property Type: ' + $scope.property.propertyTypeSelected);
            console.log('basementApartment: ' + $scope.property.isBasementApartment);
            console.log('bedrooms: ' + $scope.property.selectedBathrooms);
            console.log('bathrooms: ' + $scope.property.selectedBedrooms);
            console.log('postalCode: ' + $scope.property.postalCode);
            console.log('availabilityDate: ' + $scope.property.dt);
            console.log('leaseTermsAvailable: ' + $scope.property.selectedLeaseTerm);
            console.log('rentAmount: ' + $scope.property.rentAmount);
            console.log('electricityIncluded: ' + $scope.property.utilities.electricityIncluded);
            console.log('utilities: ' + $scope.property.utilities);
            console.log('petsWelcome: ' + $scope.property.selectedPets);
            console.log('couplesWelcome: ' + $scope.property.selectedCouples);
            console.log('selectedLgbtq: ' + $scope.property.selectedLGBT);
            
            console.log('featuresIncluded: ' + $scope.property.features);
            $scope.property.userId = $rootScope.user._id;
            $scope.property.email = $rootScope.user.emailAddress;


            if(typeof $scope.property.selectedLGBT == "undefined")
                $scope.property.selectedLGBT = "No";
            if(typeof $scope.property.selectedCouples == "undefined")
                $scope.property.selectedCouples = "No";
            if(typeof $scope.property.selectedPets == "undefined")
                $scope.property.selectedPets = "No";


            console.log('$scope.property.userId: ' + $scope.property.userId);
            SharedPropertyListing.addSharedPropertyListingPart1({
                property: $scope.property

            },
            function(res) {
                console.log('id: ' + res.property._id);
                $location.path('/shared_part2');
                $rootScope.property = res.property;
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

    $scope.publishPropertyPictures = function()
    {
        //console.log('publishPropertyPictures');
        SharedPropertyListing.publishPropertyPictures({
                property: $scope.property
            },
            function(res) {

                //$location.path('/part3');
                $rootScope.success = "We've published pictures ";
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
        });
    };

    $scope.deletePropertyPictures = function(_file)
    {
        _file.cancel();
        var name = _file.getFileName();
        $scope.property.filename = name;

        try {
            SharedPropertyListing.removePropertyPictures({
                property: $scope.property
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
    };

    $scope.publishProfilePictures = function()
    {
        console.log('publishProfilePictures');
        SharedPropertyListing.publishProfilePictures({
                property: $scope.property,
                apartmate: $scope.apartmate
            },
            function(res) {
                // console.log($scope.apartmate);
                console.log(res);

                if(res.success != 0){
                    $scope.property = res.propertySaved;
                    $scope.apartmate = res.profileSaved;
                }

                $rootScope.user = res.profileSaved;
                console.log("WE HERE");
                console.log($scope.apartmate);
                console.log($scope.property._id);
                
                // TODO: Remove this stupid Hack!

                $rootScope.property = $scope.property;
                $rootScope.property.property = $scope.property;
                $rootScope.property.lat = $scope.property.location.lat;
                $rootScope.property.lon = $scope.property.location.lon;
                $rootScope.property.price = $scope.property.rentAmount;
                $rootScope.property.daysAgo = 0;
                
                console.log($rootScope.property);
                $scope.$emit('RoommateProfileCreatedEmit', {});
                $location.path('/property_listing/' + $scope.property._id);
                $scope.$emit('MatchmakingQuestionsEmit', {});


                $rootScope.success = "We've published pictures ";
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
        });

        

    };
    
    $scope.deleteProfilePictures = function(_file)
    {
        _file.cancel();
        var name = _file.getFileName();
        $scope.property.filename = name;

        try {
            SharedPropertyListing.removeProfilePictures({
                property: $scope.property
            },
            function(res) {

                //$location.path('/part3');
                $rootScope.success = "We've removed pictures ";
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
        } catch(err) {
            $rootScope.error = err.message;
        }
    }


    $scope.updateSharedPropertyPart2ById = function()
    {
        try {
            $scope.property._id = $rootScope.property._id;
            $scope.property.userId = $rootScope.user._id;

            SharedPropertyListing.updateSharedPropertyPart2ById({
                property: $scope.property
            },
            function(res) {

                $location.path('/shared_part3');
                $rootScope.success = "We've created the second part of the listing for " + res.property._id;
                $rootScope.property = res.property;
                $scope.publishPropertyPictures();
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };

    $scope.updateAndFinishSharedPropertyById = function()
    {
        try {
            
            console.log('updateAndFinishSharedPropertyById');
            $scope.property._id = $rootScope.property._id;
            $scope.property.published = true;

            SharedPropertyListing.updateAndFinishSharedPropertyById({
                property: $scope.property,
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res.apartmate);
                console.log(res.property);
                $scope.apartmate = res.apartmate;
                $scope.property = res.property;

                $rootScope.success = "We've finished creating the listing for " + res.property._id;

                console.log($rootScope.property);

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

    $scope.utilitiesSelected = function(_utility){
        $scope.property.utilities.push({"name": _utility});
        console.log($scope.property);
    };
    
}]);
