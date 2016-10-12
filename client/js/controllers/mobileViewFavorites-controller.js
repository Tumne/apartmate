angular.module('angular-client-side-auth')
.controller('MobileViewFavoritesCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'Auth', 'PropertyListing', '$modal', function($rootScope, $timeout, $scope, $location, $window, Auth, PropertyListing, $modal) {

    console.log('MobileViewFavoritesCtrl');


    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    $rootScope.user = Auth.user;

    $scope.originalPropertiesArray = new Array();

    $scope.$on('loginEventBroadcast', function(event, args) 
    {
      console.log('Logged in: ' + args.user.emailAddress);
      if ($scope.originalPropertiesArray && $scope.originalPropertiesArray.length > 0)
        renderProperties($scope.originalPropertiesArray);
      else 
        getPropertyListingsByFavorites();
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

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.openLogin = function (size, _status) {


        var modalInstance = $modal.open({
          templateUrl: 'loginModal',
          controller: 'LoginModalCtrl',
          size: size,
          resolve: {
            status: function () {
              return _status;
            }
          }
        });

        modalInstance.result.then(function (_user) {
          $rootScope.user = _user;
          console.log('email: ' + $rootScope.user.emailAddress);
          $scope.loggedIn = true;
          if ($rootScope.nextTask && $rootScope.nextTask === 'addToFavorite')
          {
            
            $scope.toggleFavorite($rootScope.selectedProperty);
          } else {

          }
        }, function () {
            console.log('Modal Dismissed');
        });
    };


    $scope.toggleFavorite = function(property)
    {
        // Every user will have a list of favorite listings.

        // If user is not logged in, it will ask them to login
        // If user is logged in, 
        // It will 
        // - Turn Favorite to true on the property on the local model under $scope.properties
        // - setSelectedStateOf Property to true

        console.log('toggleFavorite');
        console.log('$scope.loggedIn: ' + $scope.loggedIn);

        // - it will make a call to /addToFavorites(PropertyID)
        if ($scope.loggedIn === true)
        {
          if (property.favoritedByThisUser === true)
          {
              property.favoritedByThisUser = false;
              // removeFromFavorites();

              for (var i = 0; i < $scope.properties.length; i++)
              {
                if (property._id === $scope.properties[i]._id)
                  property.favoritedByThisUser = false;
              }

              if ($rootScope.user && $rootScope.user.favoriteProperties)
              {
                for (var s = 0; s < $rootScope.user.favoriteProperties.length; s++)
                {
                  if ($rootScope.user.favoriteProperties[s].id == property._id)
                  {
                    $rootScope.user.favoriteProperties.splice(s, 1);

                  }
                }
                for (var s = 0; s < $scope.originalPropertiesArray.length; s++)
                {
                  if ($scope.originalPropertiesArray[s]._id == property._id)
                  {
                    $scope.originalPropertiesArray.splice(s, 1);

                  }
                }

                
              } 
              Auth.removeFromFavorites({
                  user: $rootScope.user
              },
              function(res) {

                  console.log('Removed from Favorites');
                  renderProperties($scope.originalPropertiesArray);
                  //$scope.allNeighbourHoodProperties = res.properties;      
                  //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
              },
              function(err) {
                  console.log('err: ' + err);
                  $rootScope.error = err.message;
              });
              
          } else {
             
             property.favoritedByThisUser = true;

             for (var i = 0; i < $scope.properties.length; i++)
              {
                if (property._id === $scope.properties[i]._id)
                  property.favoritedByThisUser = true;
              }

              if ($rootScope.user.favoriteProperties)
              {
                $rootScope.user.favoriteProperties.push({"id": property._id});
              } else {
                var favoriteProperties = [];
                favoriteProperties.push({"id": property._id});
                $rootScope.user.favoriteProperties = favoriteProperties;
              }
              Auth.addToFavorites({
                  user: $rootScope.user
              },
              function(res) {
                  console.log('Saved to Favorites');
                  renderProperties($scope.originalPropertiesArray);
                  //renderProperties(res.properties);
                  //$scope.allNeighbourHoodProperties = res.properties;      
                  //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
              },
              function(err) {
                  console.log('err: ' + err);
                  $rootScope.error = err.message;
              });
             // addToFavorites();
          }
        } else {
            
            //$scope.alerts = new Array();
            $rootScope.nextTask = 'addToFavorite';
            $rootScope.selectedProperty = property;
            $scope.openLogin("lg", "created");
        }

        
    }



    $scope.favoritesMouseOver = function(property)
    {
      $scope.heartIcon = '/img/listing/heart_on.png';
    }

    $scope.favoritesMouseOut = function(property)
    {
      if (property.favoritedByThisUser === false)
      {
        $scope.heartIcon = '/img/listing/heart.png';
      } 
    }


    
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

    

    $scope.onViewPropertySelect = function(_property)
    {
        console.log('onViewPropertySelect');
        $rootScope.property = _property;
        $rootScope.filterParameters = $scope.filterParameters;
        $rootScope.selectedNeighbourhoods = $scope.selectedNeighbourhoods;
        $location.path('/property/'+_property._id);
        //console.log('$location.path: ' + $location.path);
    }

  
    getPropertyListingsByFavorites();

    function getPropertyListingsByFavorites()
    {
        try {
            console.log('getPropertyListingsByFavorites');
            // console.log('Rooms: ' + _rooms);
            //$scope.filterParameters.propertyType = _propertyType;

            Auth.getFavoriteProperties({
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

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var index = Math.floor(Math.random() * $dates.length);
        $dates[index].selectable = false;

    }

    $scope.setViewValue = function(asdf)
    {
        console.log('asdf: ' + asdf);
    }

    $scope.options = {
      format: 'd mmmm, yyyy',
      onClose: function(e) {
        console.log('Refresh Listings here');
      }
    }

    function refreshListings(_geometry, _propertyID)
    {
        try {
            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters
            },
            function(res) {
                //console.log('properties: ' + res.properties.length);  

                for (var s = 0; s < res.properties.length; s++)
                {
                    res.properties[s].propertyID = _propertyID;
                    $scope.selectedNeighbourhoodProperties.unshift(res.properties[s]);
                }

                renderProperties(res.properties);
            },
            function(err) {
                $rootScope.error = err;
            });

            
        }
        catch(err) {
            $addLayer.error = err.message;
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
               // console.log('property already added');
            }

             
        }
        
    }

    
}]);