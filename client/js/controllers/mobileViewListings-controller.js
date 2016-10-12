angular.module('angular-client-side-auth')
.controller('MobileViewListingsCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'Auth', 'PropertyListing', '$modal', function($rootScope, $timeout, $scope, $location, $window, Auth, PropertyListing, $modal) {

    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    $rootScope.user = Auth.user;

    $scope.editImageLink = '/img/listing/editPropertyPlaceholder.jpg';
    getPropertyListingsByUser();
    $scope.originalPropertiesArray = new Array();

    $scope.$on('loginEventBroadcast', function(event, args) 
    {
      console.log('Logged in: ' + args.user.emailAddress);
      if ($scope.originalPropertiesArray && $scope.originalPropertiesArray.length > 0)
        renderProperties($scope.originalPropertiesArray);
      else 
        getPropertyListingsByUser();
    });

    $scope.loggedIn = false;
    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      console.log('User is logged in: ' + $rootScope.user.emailAddress);

      $scope.loggedIn = true;
    } else {
        console.log('$rootScope.user: ' + $rootScope.user.emailAddress);
    }

    var returning = false;
    if ($rootScope.filterParameters && $rootScope.filterParameters != '')
    {
        returning = true;
        $scope.filterParameters = $rootScope.filterParameters;
        $scope.selectedNeighbourhoods = $rootScope.selectedNeighbourhoods;
        
    } else {
        $scope.filterParameters = {
            bedrooms: 'ALL',
            leaseTerm: 'ALL',
            availabilityDate: 'ALL',
            selectedGeometry: new Array(),
            propertyType: 'ALL',
            basementApartment: 'No',
            bathrooms: 'ALL',
            pets: { 'cats': false, 'dogs': false},
            userMinPrice: $scope.minPrice,
            userMaxPrice: $scope.maxPrice,
            price: {
                minPrice: 650,
                maxPrice: 2000
            }
        };

        $scope.selectedNeighbourhoods = new Array();
    }



    // default the user's values to the available range
    $scope.userMinPrice = $scope.filterParameters.userMinPrice;
    $scope.userMaxPrice = $scope.filterParameters.userMaxPrice;

    $scope.checked = false;

    $scope.heartIcon = '/img/listing/heart.png';
  


    $scope.properties = new Array();

    $scope.selectedBedrooms = $scope.filterParameters.bedrooms;
    $scope.selectedBathrooms = $scope.filterParameters.bathrooms;
    $scope.selectedBasementApartment = $scope.filterParameters.basementApartment;

    $scope.priceRange = {
        minPrice: $scope.filterParameters.price.minPrice,
        maxPrice: $scope.filterParameters.price.maxPrice
      };

    $scope.formattedAvailableDate = formatDate(new Date());
    $scope.loading = true; 
    //$scope.date = new Date();
    
    $scope.allNeighbourHoodProperties = new Array();
    $scope.selectedNeighbourhoodProperties = new Array();
    $scope.selectedNeighbourhoodsCount = 0;

    $scope.showNumber = 1;

    $scope.alerts = [];
    $scope.tries = 0;

    
    $scope.currencyFormatting = function(value) { 
        return ("$ " + value.toString());
    }

    function formatDate(_date) 
    {

        var dateFilter = new Date();
        dateFilter = _date;
        var m_names = new Array("January", "February", "March", 
              "April", "May", "June", "July", "August", "September", 
              "October", "November", "December");

        var curr_date = dateFilter.getDate();
        var curr_month = dateFilter.getMonth() + 1; //Months are zero based
        var curr_year = dateFilter.getFullYear();
        var fullDate = (m_names[curr_month-1] + " " + curr_date + ", " + curr_year);  

        return fullDate;
    }

    

     $scope.onEditPropertySelect = function(_property)
    {
        console.log('onEditPropertySelect');
        $rootScope.property = _property;
        $location.path('/editProperty');
        //console.log('$location.path: ' + $location.path);
    }

  

    function getPropertyListingsByUser()
    {
        try {
            
            // console.log('Rooms: ' + _rooms);
            Auth.getPropertyListingsByUser({
                user: $rootScope.user
            },
            function(res) {
                renderProperties(res.properties);
                $scope.allNeighbourHoodProperties = res.properties;     

                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }

    function renderProperties(_properties)
    {
        console.log('renderProperties');
        // bedrooms: 'ALL',
        // price: 'ALL',
        // availabilityDate: 'ALL',
        // selectedGeometry: 'ALL',
        // propertyType: 'ALL'
        $scope.originalPropertiesArray = _properties;
        $scope.properties = new Array();

        

        for (var i = 0; i < _properties.length; i++)
        {
            var prop = _properties[i];
            var daysAgo = 0
            var myImageObject = new Object();
            var tagsObj = new Object();
            var locationGiven = false;
            var formattedAvailableDate = new Date();
            formattedAvailableDate = formattedAvailableDate.toDateString();
            var addedAlready = false;
            
            for (var s = 0; s < $scope.properties.length; s++)
            {
                if ($scope.properties[s]._id === prop['_id'])
                {
                    addedAlready = true;
                }
            }
                    
            if (addedAlready === false)
            {
                // console.log("myImageObject[0]: " + myImageObject[0]);
                // console.log("daysAgo: " + daysAgo);
                // console.log("prop['bathroom']: " + prop['bathrooms']);
                //console.log("prop['bedroom']: " + prop['bedrooms']);
                // console.log("prop['tags']: " + prop['tags']);
                // console.log("prop['rentAmount']: " + prop['rentAmount']);
                // console.log("prop['_id']: " + prop['_id']);
                prop['title'] = prop['streetAddress'];
                prop['lat'] = prop['location'].lat;
                prop['lon'] = prop['location'].lon;

                $scope.properties.push({'_id': prop['_id'], 'property': prop, 'price': prop['rentAmount'], 'title': prop['title'], 'lon': prop['lon'], 'lat': prop['lat']});
               // console.log('$scope.properties length: ' + $scope.properties.length);
            } else {
                //console.log('property already added');
            }

             
        }
        
    }

    
}]);


