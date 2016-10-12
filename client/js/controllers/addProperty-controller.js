angular.module('angular-client-side-auth')
.controller('AddPropertyCtrl',
['$rootScope', '$scope', '$location', '$window', 'WholePropertySchema', 'PropertyListing', 'Auth', 'SharedPropertyListing', 'ApartmateProfile', function($rootScope, $scope, $location, $window, WholePropertySchema, PropertyListing, Auth, SharedPropertyListing, ApartmateProfile) {

    $rootScope.seo = {
      title: "Apartmate | Add Property",
      description: "My Favorites"
    };

    $scope.existingProfileImages = new Array();
    console.log("test");
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

    // If we are not on the first page, resume from where we left off on the Property in case a refresh happens
    if ($location.path() != '/addProperty/')
    {
      
      if ($rootScope.property && $rootScope.property.property)
        $scope.property = $rootScope.property.property;
      else if ($rootScope.property)
        $scope.property = $rootScope.property;
      else
      {
        console.log('Refresh happened and we do not know what the property is');
        getLastKnownProperty();
      }
       

    }

    function getLastKnownProperty()
    {
        console.log('getLastKnownProperty - $rootScope.user._id: ' + $rootScope.user._id);
        PropertyListing.getLastKnownProperty({
          userId: $rootScope.user._id
        },
        function(res) {

            $rootScope.property = res.property;
            console.log('getLastKnownProperty - $rootScope.property: ' + $rootScope.property._id);
            

        },
        function(err) {
            console.log('getLastKnownProperty - err: ' + err);
            $rootScope.error = err.message;
        });
    }

    $scope.originalPropertiesArray = new Array();
    $scope.property = new Object();
    $scope.apartmate = new Object();

    $scope.apartmate.emailAddress = $rootScope.user.emailAddress;

    $scope.loggedIn = false;
    if ($rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
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

    $scope.onlyNumbers = /^\d+$/;
    
    $scope.property.utilities = new Object();
    $scope.property.features = new Object();
    //,$scope.propertyId = '';

    $scope.status = {
      isopen: false
    };

    $scope.property.dt = null;


    $scope.today = function() {
        $scope.property.dt = new Date();
    };

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

    $scope.alerts = [];
    $scope.tries = 0;

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };


    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
      
    try {

        $scope.property.propertyTypeSelected = "Low-rise apartment or condo";
        $scope.property.isBasementApartment = "No";
        $scope.property.selectedBathrooms = '1 bathroom';
        $scope.property.selectedBedrooms = 'Studio/Bachelor';
        $scope.property.selectedLeaseTerm = "One year";
        $scope.property.selectedPets = "Yes";
        $scope.property.emailAddress = $rootScope.user.emailAddress;
    } catch(err) {
            $rootScope.error = err.message;
    }
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

    $scope.addWholePropertyListingPart1 = function()
    {
        try {
            
            // console.log('User Id: ' + $scope.user.id);
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
            // console.log('user ID: ' + $scope.property.userId);
            console.log($scope.property);
            $scope.property.email = $rootScope.user.emailAddress;

            PropertyListing.addWholePropertyListingPart1({
                property: $scope.property

            },
            function(res) {
                //console.log('id: ' + res.property._id);
                $location.path('/part2');
                $rootScope.property = res.property;
                $scope.propertyId = $rootScope.property._id;
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

    $scope.updatePropertyPart2ById = function()
    {
        try {
            
            console.log($scope.property);
            //console.log('rootScope property id: ' +  $rootScope.property._id);
            console.log('Description: ' +  $scope.property.description);
            
            $scope.property._id = $rootScope.property._id;
            console.log('$scope.property._id: ' + $scope.property._id);
        
            PropertyListing.updatePropertyPart2ById({
                property: $scope.property
            },
            function(res) {

                $location.path('/part3');
                $rootScope.success = "We've created the second part of the listing for " + res.property._id;
                $rootScope.property = res.property;

                $scope.publishPropertyPictures();


                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                console.log('updatePropertyPart2ById - err: ' + err);
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            console.log('updatePropertyPart2ById - err: ' + err);
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

    $scope.deletePropertyPictures = function(_file)
    {
        console.log('file.cancel()');
        _file.cancel();
        var name = _file.getFileName();
       // _file.name = name;
        console.log('name:  ' + name);
        $scope.property.filename = name;

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

                $rootScope.user = $scope.apartmate;

                $scope.$emit('RoommateProfileCreatedEmit', {});
                console.log($scope.property._id);
                
                // TODO: Remove this stupid Hack!

                $rootScope.property = $scope.property;
                $rootScope.property.property = $scope.property;
                $rootScope.property.lat = $scope.property.location.lat;
                $rootScope.property.lon = $scope.property.location.lon;
                $rootScope.property.price = $scope.property.rentAmount;
                $rootScope.property.daysAgo = 0;
                
                console.log($rootScope.property);

                $location.path('/property_listing/' + $scope.property._id);
                $rootScope.success = "We've published pictures ";
                
                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
        });
    };

    $scope.updateAndFinishPropertyById = function()
    {
        try {
            
            console.log('rootScope property id: ' +  $rootScope.property._id);
            console.log('Selected landlordType: ' + $scope.property.landlordType);
            $scope.property._id = $rootScope.property._id;
            $scope.property.published = true;
            $scope.property.publishedAt = Date();

            if ($scope.property.emailAddress === '' && $scope.property.phone === '')
            {
                $scope.alerts = new Array();
                $scope.alerts.push({type: 'danger', msg: "Either an email or phone number is required"});
            }

            console.log($scope.property);
            console.log($scope.apartmate);          

            PropertyListing.updateAndFinishPropertyById({
                property: $scope.property,
                apartmate: $scope.apartmate
            },
            function(res) {
                console.log(res);

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



