angular.module('angular-client-side-auth')
.controller('EditPropertyCtrl',
['$rootScope', '$scope', '$location', '$window', 'WholePropertySchema', 'PropertyListing', 'Auth', 'SharedPropertyListing', 'ApartmateProfile', function($rootScope, $scope, $location, $window, WholePropertySchema, PropertyListing, Auth, SharedPropertyListing, ApartmateProfile) {

    $scope.originalPropertiesArray = new Array();
    if (!$rootScope.property)
    {
      $location.path('/')
    } else 
    {
      if ($rootScope.property && $rootScope.property.property)
        $scope.property = $rootScope.property.property;
      else if ($rootScope.property)
        $scope.property = $rootScope.property
      //$scope.property.userId = $rootScope.user._id;
      //console.log('$scope.property.userId: ' + $scope.property.userId);
      console.log('$scope.property address: ' +  $scope.property.streetAddress);
      console.log('property phone: ' + $scope.property.phone);
      console.log('property email: ' + $scope.property.email);
    }

    $scope.loggedIn = true;

    $scope.$on('loginEventBroadcast', function(event, args) 
    {
      console.log('Logged in: ' + args.user.emailAddress);
      $scope.loggedIn = true;
      $scope.property.userId = args.user.id;
      console.log('args.user.id: ' + args.user.id);
    });

    $scope.onlyNumbers = /^\d+$/;
    
    $scope.property.utilities = new Object();
    $scope.property.features = new Object();
    //,$scope.propertyId = '';

    $scope.property.selectedBedrooms = $scope.property.bedrooms;
    $scope.property.selectedBathrooms = $scope.property.bathrooms;
    $scope.property.isBasementApartment = $scope.property.basementApartment;

    $scope.property.selectedLeaseTerm = $scope.property.leaseTermsAvailable[0].name;
    $scope.property.selectedPets = $scope.property.petsWelcome[0].name; 
    $scope.property.emailAddress = $scope.property.email;
    $scope.property.emailAddress = $rootScope.user.emailAddress;

    for (var i = 0; i < $scope.property.utlitiesIncluded.length; i++)
    {
      var utilityName = $scope.property.utlitiesIncluded[i]['name'];
      $scope.property.utilities[utilityName] = true;
    }

    for (var i = 0; i < $scope.property.featuresIncluded.length; i++)
    {
        var featureName = $scope.property.featuresIncluded[i]['name'];
        $scope.property.features[featureName] = true;
    }
   
    $scope.existingImages = new Array();
    for (var i = 0; i < $scope.property.addedImages.length; i++)
    {
      var url = $scope.property.addedImages[i].url;
      $scope.existingImages.push(url);
    }

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

    $scope.onPropertyTypeSelect = function(_propertyType)
    {
        $scope.property.propertyTypeSelected = _propertyType;
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

    $scope.onPetsSelect = function(petSelected)
    {
        $scope.property.selectedPets = petSelected;
    };

    $scope.onLandlordTypeSelect = function(landlordTypeSelected)
    {
        $scope.property.landlordType = landlordTypeSelected;
    };

    
    $scope.updateWholePropertyListingPart1 = function()
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
            console.log('user ID: ' + $scope.property.userId);
            console.log($scope.property);

            PropertyListing.updateWholePropertyListingPart1({
                property: $scope.property

            },
            function(res) {
                console.log('id: ' + res.property._id);
                $rootScope.property = $scope.property;
                $rootScope.property.property = $scope.property;
                $location.path('/edit_part2');
                $scope.propertyId = $rootScope.property._id;
                $rootScope.success = "We've updated the first part of the listing for " + res.property._id;
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

    $scope.updatePropertyPart2ById = function()
    {
        try {
            
            console.log('rootScope property id: ' +  $rootScope.property._id);
            console.log('Description: ' +  $scope.property.description);
            $scope.property._id = $rootScope.property._id;
            $scope.property.property = null;
            PropertyListing.updatePropertyPart2ById({
                property: $scope.property
            },
            function(res) {
                console.log('how many times?');
                $location.path('/edit_part3');
                $rootScope.success = "We've created the second part of the listing for " + res.property._id;
                $rootScope.property = res.property;

                $scope.publishPropertyPictures();


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
        console.log('publishPropertyPictures');
        PropertyListing.publishPropertyPictures({
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

    $scope.removeExistingPropertyPictures = function(_file)
    {
        try {
            
            $scope.property.filename = _file;
            console.log('$scope.property._id: ' + $scope.property._id);
            $scope.property.property = null;

            for (var i = 0; i < $scope.existingImages.length; i++)
            {
              if ($scope.existingImages[i] === _file)
                $scope.existingImages.splice(i, 1);
            }
            PropertyListing.removeExistingPropertyPictures({
                property: $scope.property
            },
            function(res) {

                $rootScope.success = "We've removed pictures ";
                console.log('removed');
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

    $scope.deletePropertyPictures = function(_file)
    {
        console.log('file.cancel()');
        _file.cancel();
        var name = _file.getFileName();
       // _file.name = name;


        console.log('name:  ' + name);
        $scope.property.filename = name;
        $scope.property.property = null;
        try {
            PropertyListing.removePropertyPictures({
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
    }

    // $scope.updateAndFinishPropertyById = function()
    // {
    //     try {
            
    //         console.log('rootScope property id: ' +  $rootScope.property._id);
    //         console.log('user id: ' + $rootScope.user._id);
    //         $scope.property.userId = $rootScope.user._id;
    //         console.log('Selected landlordType: ' + $scope.property.landlordType);
    //         $scope.property._id = $rootScope.property._id;

    //         PropertyListing.updateAndFinishPropertyById({
    //             property: $scope.property
    //         },
    //         function(res) {

    //             $location.path('/listings');
    //             $rootScope.success = "We've finished creating the listing for " + res.property._id;
    //             $rootScope.property = res.property;
    //             //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
    //         },
    //         function(err) {
    //             $rootScope.error = err.message;
    //         });
    //     }
    //     catch(err) {
    //         $rootScope.error = err.message;
    //     }
    // };

    $scope.publishProfilePictures = function()
    {

        console.log('publishProfilePictures');
        SharedPropertyListing.publishProfilePictures({
                property: $scope.property,
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res);
                if(res.success != 0){
                    $rootScope.user = res.profileSaved;
                    $scope.$emit('RoommateProfileCreatedEmit', {});
                    $location.path('/listings');
                    $rootScope.success = "We've published pictures ";    
                } else {
                    $rootScope.user = $scope.apartmate;
                    $scope.$emit('RoommateProfileCreatedEmit', {});
                    $location.path('/listings');
                }
                
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
        });
    };
    $scope.updateAndFinishPropertyById = function()
    {
        try {
            
            console.log('updateAndFinishSharedPropertyById');
            $scope.property._id = $rootScope.property._id;
            $scope.property.published = true;

            PropertyListing.updateAndFinishPropertyById({
                property: $scope.property,
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res.apartmate);
                console.log(res.property);
                $scope.apartmate = res.apartmate;
                $scope.property = res.property;
                // $location.path('/listings');
                $rootScope.success = "We've finished creating the listing for " + res.property._id;
                $rootScope.property = res.property;

                // TODO: Hack
                // $rootScope.property.property = $rootScope.property;
                // $rootScope.property.lat = $rootScope.property.location.lat;
                // $rootScope.property.lon = $rootScope.property.location.lon;

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

    $scope.property.dt = $scope.property.availabilityDate;
    console.log('$scope.property.dt: ' + $scope.property.dt);

    $scope.onBackButtonSelect = function (){
        $location.path('/property_listing/' + $scope.property._id);
    };
}]);



