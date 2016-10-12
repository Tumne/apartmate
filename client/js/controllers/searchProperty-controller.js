angular.module('angular-client-side-auth')
.controller('SearchPropertyCtrl',
['$rootScope', '$timeout', '$scope', '$log', '$location', '$window', 'Auth', 'PropertyListing', 'ApartmateProfile', 'leafletData', '$modal', '$cookieStore', '$stateParams', 'baseUrl', '$state', function($rootScope, $timeout, $scope, $log, $location, $window, Auth, PropertyListing, ApartmateProfile, leafletData, $modal, $cookieStore, $stateParams, baseUrl, $state) {

    function resetFilters() {
      $scope.isScrolled = false;
      $scope.isScrolledApartmate = false;
      $scope.moreFilters = false;
      $scope.moreFiltersApartmate = false;
      $scope.filtersTop = false;
    }

    function scrollBind() {

      angular.element($window).bind("scroll", function() {
        if(!$scope.moreFilters && !$scope.moreFiltersApartmate){
          if (this.pageYOffset > 152 ) {
            $scope.isScrolled = true;
          } else {
            $scope.isScrolled = false;
          }
          $scope.$apply();
        }
      });
    }

    resetFilters();
    scrollBind();

    $scope.showMoreFilters = function(){

      if ($window.pageYOffset <= 140) {
        $scope.filtersTop = false;
      } else {
        $scope.filtersTop = !$scope.filtersTop;
      }

      if($scope.filterParameters.propertyType != "Apartmate"){
        $scope.moreFilters = !$scope.moreFilters;
      } else {
        
        if($scope.ageRange.minAge == 18 && $scope.ageRange.maxAge == 60)
          $scope.ageRange = {
              minAge: 18,
              maxAge: 60
          };
        $scope.moreFiltersApartmate = !$scope.moreFiltersApartmate;
      }

    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $rootScope.seo = {
      title: "Apartmate | Search",
      description: "Search for Apartment rentals and roommates"
    };

    console.log("$stateParams: " + $stateParams);
    $scope.showListings = true;

    function renderMarkers(_properties) {

      for (var i = 0; i < _properties.length; i++)
        {
          if(_properties[i].published){
            drawMarker(_properties[i].location.lat, _properties[i].location.lon, _properties[i]._id, _properties[i].title, _properties[i].propertythumb, _properties[i].rentAmount, _properties[i].propertyType);
            console.log(_properties[i].published);
            console.log(_properties[i]);
          }
        }
    }

    if($rootScope.propertiesGlobal){

      renderMarkers($rootScope.propertiesGlobal);
    }

    $scope.properties = new Array();
    $scope.selectedGender = 'ALL';
    //$scope.markers = new Array();
    $scope.formattedAvailableDate = formatDate(new Date());
    //$scope.date = new Date();
    $scope.selectedNeighbourhoods = new Array();
    // console.log($scope.selectedNeighbourhoods);

    $scope.allNeighbourHoodProperties = new Array();
    $scope.selectedNeighbourhoodProperties = new Array();
    $scope.selectedNeighbourhoodsCount = 0;

    $scope.priceRange = {
        minPrice: 100,
        maxPrice: 3000
    };

    $scope.budgetRange = {
        minPrice: 0,
        maxPrice: 3000
    };

    $scope.ageRange = {
        minAge: 18,
        maxAge: 60
    };

    $scope.showListings = true;
    
    $scope.originalPropertiesArray = new Array();
    $scope.loggedIn = false;


    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      console.log("EHH!");
      console.log($rootScope.user);
      
      $scope.user = $rootScope.user;
      //$scope.$emit('FBLoginEventEmit', {user: $rootScope.user});


      if(!$rootScope.user.fbModalInit && $rootScope.user.profileCreated && typeof $rootScope.currentProperty != "undefined"){

        setTimeout(function(){

          var modalInstance = $modal.open({
            templateUrl: 'boostModal',
            controller: 'BoostModalCtrl',
            size: 'lg',
            resolve: {
              status: function () {
                return $rootScope.currentProperty;
              }
            }
          });

          modalInstance.result.then(function (_user) {
            // TODO: use Promise library here and replace with dismissModal() function
            ApartmateProfile.dismissFBModal({
              email: $rootScope.user.emailAddress
            },
            function(res) {
              console.log(res);
              $rootScope.user = res.apartmate;
              $state.transitionTo('public.nav.search', $stateParams, {
                reload: true,
                inherit: false,
                notify: true
              });
            },
            function(err) {
                console.log(err);
            });
            
          }, function () {
            // TODO: use Promise library here and replace with dismissModal() function
            ApartmateProfile.dismissFBModal({
              email: $rootScope.user.emailAddress
            },
            function(res) {
              console.log(res);
              $rootScope.user = res.apartmate;
            },
            function(err) {
                console.log(err);
            });

            console.log('Modal Dismissed');
          });

        }, 5000);
      }

      $scope.loggedIn = true;
    } else {
      $scope.user = Auth.user;
      $scope.userRoles = Auth.userRoles;
      $scope.accessLevels = Auth.accessLevels;
      $rootScope.user = Auth.user;
      console.log('User is not logged in');
    }

    $scope.$on('loginEventBroadcast', function(event, args)
    {
      //getPropertyListingsByFilter();
      $scope.loggedIn = true;
      if ($scope.originalPropertiesArray && $scope.originalPropertiesArray.length > 0){
        renderProperties($scope.originalPropertiesArray);
      }
      else{
        getPropertyListingsByFilter();
      }

    });

    var returning = false;
    if ($rootScope.filterParameters && $rootScope.filterParameters != '' && $rootScope.filterParameters.pets)
    {
        console.log('SearchPropertyCtrl - Returning = true');
        returning = true;
        $scope.filterParameters = $rootScope.filterParameters;
        $scope.selectedNeighbourhoods = $rootScope.selectedNeighbourhoods;
        
    } else {
        $scope.filterParameters = {
            bedrooms: 'ALL',
            age: 'ALL',
            gender: 'ALL',
            leaseTerm: 'ALL',
            availabilityDate: 'ALL',
            availabilityDateApartmate: 'ALL',
            selectedGeometry: new Array(),
            propertyType: 'ALL',
            basementApartment: true,
            bathrooms: 'ALL',
            pets: { 'cats': false, 'dogs': false},
            userMinPrice: $scope.minPrice,
            userMaxPrice: $scope.maxPrice,
            price: {
                minPrice: 400,
                maxPrice: 3000
            },
            budget:  {
                minPrice: 0,
                maxPrice: 3000
            },
            ageRange: {
                minAge: 18,
                maxAge: 60
            },
            lease: {
              oneYear: true,
              monthly: true,
              sublet: true
            }
        };
        // console.log($scope.filterParameters.propertyType);
        $scope.selectedNeighbourhoods = new Array();
    }
    

    // default the user's values to the available range
    $scope.userMinPrice = $scope.filterParameters.userMinPrice;
    $scope.userMaxPrice = $scope.filterParameters.userMaxPrice;

    $scope.checked = false;

    $scope.heartIcon = '/img/listing/heart_shadow.png';
    $scope.img_entirePlace = '/img/button_entirePlace.png';
    $scope.img_sharedPlace ='/img/button_sharedPlace.png';
    $scope.img_apartmate ='/img/button_apartmate.png';


    if ($scope.filterParameters.propertyType === 'Entire')
    {
        $scope.img_entirePlace = '/img/button_entirePlace_on.png';
    } 

    if ($scope.filterParameters.propertyType === 'Shared')
    {
        $scope.img_sharedPlace ='/img/button_sharedPlace_on.png';
    }

    if ($scope.filterParameters.propertyType === 'Apartmate')
    {
        $scope.img_apartmate ='/img/button_apartmate_on.png';
    }


    $scope.properties = new Array();

    $scope.selectedBedrooms = $scope.filterParameters.bedrooms;
    $scope.selectedBathrooms = $scope.filterParameters.bathrooms;
    $scope.selectedBasementApartment = $scope.filterParameters.basementApartment;

    $scope.priceRange = {
        minPrice: $scope.filterParameters.price.minPrice,
        maxPrice: $scope.filterParameters.price.maxPrice
      };
    
    // $scope.budgetRange = {
    //     minPrice: $scope.filterParameters.budget.minPrice,
    //     maxPrice: $scope.filterParameters.budget.maxPrice
    //   };

    $scope.highlightedMarkers = new Array();
    $scope.formattedAvailableDate = formatDate(new Date());
    $scope.test = 'Working';
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

    $scope.openLogin = function (size, _status) 
    {
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

          }
        }, function () {
            console.log('Modal Dismissed');
        });
    };


    $scope.toggleFavorite = function(property)
    {

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

              if ($rootScope.user && $rootScope.user.favoriteProperties)
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
      $scope.heartIcon = '/img/listing/heart_on_shadow.png';
    }

    $scope.favoritesMouseOut = function(property)
    {
      if (property.favoritedByThisUser === false)
      {
        $scope.heartIcon = '/img/listing/heart_shadow.png';
      }
    }


    $scope.toggleSlide = function (_check)
    {
        if ($scope.checked  != true)
            $scope.checked = true;
        else
            $scope.checked = false;
    }

    $scope.onMoreFilterSelect = function ()
    {
        console.log('checked: ' + $scope.checked);

        if ($scope.checked  != true)
            $scope.checked = true;
        else
            $scope.checked = false;
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

    $scope.onLeaseTermFilterSelect = function(_leaseTerm)
    {
        try {
            $scope.filterParameters.leaseTerm = _leaseTerm;

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                removeMarkers();
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

    $scope.onViewPropertySelect = function(_property)
    {
        console.log('onViewPropertySelect');
        $rootScope.property = _property;
        $rootScope.filterParameters = $scope.filterParameters;
        $rootScope.selectedNeighbourhoods = $scope.selectedNeighbourhoods;
        $location.path('/property/'+_property._id);
        //console.log('$location.path: ' + $location.path);
    }

    $scope.onDateFilterSelect = function(_dateFilter)
    { 

        $scope.formattedAvailableDate = formatDate(_dateFilter);
        try {
            
            $scope.filterParameters.availabilityDate = new Date(_dateFilter);
            //$scope.filterParameters.availabilityDate = ;
            removeMarkers();

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
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

    $scope.onPriceFilterSelect = function()
    {

        try {
            $scope.filterParameters.price = $scope.priceRange;
            removeMarkers();

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                console.log('Result: ' + res.properties.length);

                $scope.allNeighbourHoodProperties = res.properties;
                renderProperties(res.properties);

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

    $scope.onPropertyFilterSelect = function(_propertyType)
    {
        console.log('onPropertyFilterSelect: ' + _propertyType);
        console.log($scope.filterParameters.propertyType);
        if (_propertyType === 'Entire' || _propertyType === 'Shared')
        {
            initMap();

            if($scope.filterParameters.propertyType == "Apartmate"){
              resetFilters();
              $(window).scrollTop(0);

              // scrollBind();
            }

            if (_propertyType === $scope.filterParameters.propertyType)
            {
                $scope.filterParameters.propertyType = 'ALL';
                $rootScope.propertyType = _propertyType;

            } else {

                $scope.filterParameters.propertyType = _propertyType;
                if($rootScope.hackBack){
                  $state.transitionTo('public.nav.search', $stateParams, {
                    reload: true,
                    inherit: false,
                  });
                  $rootScope.hackBack = false;
                }

            }
            
            $scope.showListings = true;
            getPropertiesByTypeFilter();
        }
        else
        {
            // if($scope.budgetRange.minPrice == 0 && $scope.budgetRange.maxPrice == 3000)
              $scope.budgetRange = {
                  minPrice: 0,
                  maxPrice: 3000
              };


            resetFilters();
            $(window).scrollTop(0);

            // scrollBind();

            removeMarkers();
            $scope.filterParameters.propertyType = _propertyType;
            $scope.showListings = false;
            $scope.checked = false;
            // $location.path('/browse_apartmates');
            //getApartmates(_propertyType);
        }
    };

    function getPropertiesByTypeFilter()
    {
        try {
            console.log("works");
            console.log($scope.filterParameters)
            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                removeMarkers();
                console.log(res.properties);
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



    $scope.onBasementApartmentSelect = function(_answer)
    {
        try {
            $scope.filterParameters.basementApartment = _answer;
            getPropertiesByTypeFilter();
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }

    $scope.onBathroomFilterSelect = function(_rooms)
    {
        


        try {
            
            // console.log('Rooms: ' + _rooms);
            $scope.filterParameters.bathrooms = _rooms;
            //$scope.selectedBedrooms = _rooms;
            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                removeMarkers();
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

    $scope.dogsFilterChanged = function ()
    {
        try {
            //console.log('dogsFilterChanged');
            getPropertiesByTypeFilter();
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }

    $scope.catsFilterChanged = function ()
    {
        try {
            console.log('catsFilterChanged');
            getPropertiesByTypeFilter();
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }


    $scope.onBedroomFilterSelect = function(_rooms)
    {
        try {
            
            // console.log('Rooms: ' + _rooms);
            $scope.filterParameters.bedrooms = _rooms;
            $scope.selectedBedrooms = _rooms;
            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                removeMarkers();
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

    var geojson;
    var map = leafletData.getMap();
    //var markers;
    var thisMap;
    var info = L.control();
    var done = false;
    var doneOnce = false;
    var marker;
    function initMap (){

      var tilesDict = {
                  
          mapbox_terrain: {
              name: 'Mapbox Terrain',
              url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
              type: 'xyz',
              options: {
                  apikey: 'pk.eyJ1IjoiYXBhcnRtYXRlIiwiYSI6InVxQjhhc0UifQ._WPn__CD5LrY6agNTz9sOQ',
                  mapid: 'apartmate.ki4lhef7'
              }
          },
          mapbox_night: {
              name: 'Mapbox Night',
              url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
              type: 'xyz',
              options: {
                  apikey: 'pk.eyJ1IjoidG9tYmF0b3NzYWxzIiwiYSI6Imo3MWxyTHMifQ.TjXg_IV7ZYMHX6tqjMikPg',
                  mapid: 'examples.map-0l53fhk2'
              }
          }
      };
    
      angular.extend($scope, {
        toronto: {
            lat: 43.65,
            lng: -79.408,
            zoom: 11
        },
        tiles: tilesDict.mapbox_terrain,
        markers: {},
        iconDefault: {            
            iconUrl: '/img/icon_listing.png',
            className: 'listingIcon',
            shadowUrl: '/img/icon_listing_shadow.png',
            iconSize:     [37, 49], // size of the icon
            shadowSize:   [37, 49], // size of the shadow
            iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [29, 42],  // the same for the shadow
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        },
        iconHover: {            
            iconUrl: '/img/icon_listing_hover.png',
            shadowUrl: '/img/icon_listing_shadow.png',
            iconSize:     [37, 49], // size of the icon
            shadowSize:   [37, 49], // size of the shadow
            iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [29, 42],  // the same for the shadow
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        }
      });
    }
    initMap();
    // angular.extend($scope, {
    //     toronto: {
    //         lat: 43.65,
    //         lng: -79.408,
    //         zoom: 11
    //     },
    //     tiles: tilesDict.mapbox_terrain,
    //     markers: {},
    //     iconDefault: {            
    //         iconUrl: '/img/icon_listing.png',
    //         className: 'listingIcon',
    //         shadowUrl: '/img/icon_listing_shadow.png',
    //         iconSize:     [37, 49], // size of the icon
    //         shadowSize:   [37, 49], // size of the shadow
    //         iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
    //         shadowAnchor: [29, 42],  // the same for the shadow
    //         popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    //     },
    //     iconHover: {            
    //         iconUrl: '/img/icon_listing_hover.png',
    //         shadowUrl: '/img/icon_listing_shadow.png',
    //         iconSize:     [37, 49], // size of the icon
    //         shadowSize:   [37, 49], // size of the shadow
    //         iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
    //         shadowAnchor: [29, 42],  // the same for the shadow
    //         popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    //     }
    // });
    // var marker = L.marker([43.65, -79.408]).addTo(map);

    function removeMarkers() {
        $scope.markers = {};
    }

    //$scope.addMarkers();

    //Get color depending on selected estimate
    function getColor(d) {
        return d > 20.1 ? '#e31a1c' :
               d > 16.2 ? '#fd8d3c' :
               d > 11.3 ? '#fecc5c' :
                           '#ffffb2';
    }

    function style(feature) {
        return {
            weight: 3,
            opacity: 0.5,
            //color: feature.properties.stroke,
            color: '#ccc',
            title: feature.properties.title,
            fillOpacity: 0.010000000298023224,
            fillColor: feature.properties.fill
        };
    }

    var ListingIcon = L.Icon.extend({
        options: {
            iconUrl: '/img/icon_listing.png',
            className: 'listingIcon',
            shadowUrl: '/img/icon_listing_shadow.png',
            iconSize:     [37, 49], // size of the icon
            shadowSize:   [37, 49], // size of the shadow
            iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [29, 42],  // the same for the shadow
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        }
    });

    var ListingHoverIcon = L.Icon.extend({
        options: {
            iconUrl: '/img/icon_listing_hover.png',
            shadowUrl: '/img/icon_listing_shadow.png',
            iconSize:     [37, 49], // size of the icon
            shadowSize:   [37, 49], // size of the shadow
            iconAnchor:   [19, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [29, 42],  // the same for the shadow
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        }
    });


    var listingIcon = new ListingIcon(); 
    var listingHoverIcon = new ListingHoverIcon();

    // getPropertyListingsByFilter();

    function initializeLeaflet()
    {
        console.log('initializeLeaflet');
        doneOnce = true;
        leafletData.getMap().then(function(map) 
        {
            var data = {"features":[{"geometry":{"coordinates":[[[-79.404888,43.627874],[-79.394931,43.633714],[-79.388065,43.630732],[-79.384632,43.625514],[-79.377079,43.62365],[-79.370384,43.623898],[-79.365062,43.624768],[-79.356479,43.63359],[-79.352531,43.633341],[-79.349441,43.629738],[-79.355106,43.629987],[-79.357509,43.626259],[-79.362831,43.622655],[-79.368839,43.61843],[-79.374675,43.615323],[-79.379482,43.613832],[-79.383945,43.612092],[-79.38858,43.611968],[-79.391155,43.615199],[-79.393215,43.619176],[-79.404888,43.627874]]],"type":"Polygon"},"id":"ci3zfkakj00rkkaqq2thp0coh","properties":{"description":"","fill":"#57dfc9","fill-opacity":0.20000000298023224,"id":"marker-i3z96egl3","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"The Islands"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.417333,43.647441],[-79.41832,43.64977],[-79.406046,43.652285],[-79.402656,43.643963],[-79.415016,43.641479],[-79.417333,43.647441]]],"type":"Polygon"},"id":"ci3zfkaks00rrkaqqrhvgeyl4","properties":{"description":"","fill":"#A693c5","fill-opacity":0.20000000298023224,"id":"marker-i3za7s5rc","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Trinity Bellwoods"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.403965,43.647177],[-79.386777,43.650842],[-79.386477,43.650065],[-79.384739,43.647721],[-79.402678,43.64401],[-79.403965,43.647177]]],"type":"Polygon"},"id":"ci3zfkal700s5kaqqusbv6jnk","properties":{"description":"","fill":"#57dfc9","fill-opacity":0.20000000298023224,"id":"marker-i3zcqhpsy","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Fashion District "},"type":"Feature"},{"geometry":{"coordinates":[[[-79.376263,43.645035],[-79.381842,43.643746],[-79.382486,43.645361],[-79.383645,43.645656],[-79.384717,43.647721],[-79.38652,43.650096],[-79.388365,43.654832],[-79.380769,43.656384],[-79.376263,43.645035]]],"type":"Polygon"},"id":"ci3zfkalb00s8kaqqv9h81gph","properties":{"description":"","fill":"#57dfc9","fill-opacity":0.20000000298023224,"id":"marker-i3zd5pip13","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Financial District"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.381799,43.643777],[-79.376263,43.645081],[-79.356544,43.649522],[-79.354376,43.647767],[-79.379653,43.638047],[-79.381799,43.643777]]],"type":"Polygon"},"id":"ci3zfkale00sakaqq5sv9wnie","properties":{"description":"","fill":"#57dfc9","fill-opacity":0.20000000298023224,"id":"marker-i3zd79k114","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Queen's Quay"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.364418,43.655608],[-79.353561,43.65803],[-79.35414,43.658775],[-79.3559,43.66458],[-79.367036,43.661957],[-79.364418,43.655608]]],"type":"Polygon"},"id":"ci3zfkalf00sbkaqqnk4zqoli","properties":{"description":"","fill":"#FF8272","fill-opacity":0.20000000298023224,"id":"marker-i3zdbnsx15","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Regent Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.388837,43.668228],[-79.386112,43.668756],[-79.386756,43.670277],[-79.376821,43.672372],[-79.373109,43.663183],[-79.381628,43.661352],[-79.383108,43.661352],[-79.385855,43.660808],[-79.387142,43.664425],[-79.388837,43.668228]]],"type":"Polygon"},"id":"ci3zfkalk00sgkaqqc6auelyo","properties":{"description":"","fill":"#57dfc9","fill-opacity":0.20000000298023224,"id":"marker-i3ze59nv1b","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Church-Wellesley Village"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.369461,43.654568],[-79.353561,43.658045],[-79.347016,43.651214],[-79.354376,43.647798],[-79.356586,43.649522],[-79.366414,43.647333],[-79.369461,43.654568]]],"type":"Polygon"},"id":"ci3zfkalp00skkaqqkr1abgrj","properties":{"description":"","fill":"#FF8272","fill-opacity":0.20000000298023224,"id":"marker-i3zei40z1g","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Corktown / Distillery"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.39621925354004,43.69623821044928],[-79.37338829040527,43.70101638296418],[-79.37137126922606,43.696083068595954],[-79.36991214752197,43.69620718211072],[-79.36660766601562,43.69425236441406],[-79.3632173538208,43.69350765519633],[-79.36180114746094,43.69217336138681],[-79.35931205749512,43.691397595524904],[-79.36055660247803,43.68944262104756],[-79.36115741729736,43.68525317544608],[-79.36240196228027,43.682646261618416],[-79.36167240142822,43.67578705438055],[-79.36677932739256,43.674700682665446],[-79.37068462371826,43.672093310306806],[-79.3767786026001,43.67243475837122],[-79.38677787780762,43.67032395740422],[-79.39403057098389,43.68820133433725],[-79.39501762390137,43.69018738074329],[-79.39621925354004,43.69623821044928]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i3zzieif6","stroke":"#FceC56","stroke-opacity":1,"stroke-width":4,"title":"Rosedale / Moore Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.40849304199219,43.75317916384933],[-79.39501762390137,43.76161025744937],[-79.37501907348633,43.76570138943363],[-79.36257362365723,43.76656916934105],[-79.35999870300293,43.75293117252437],[-79.36574935913086,43.752745178356285],[-79.40231323242188,43.744250828740604],[-79.40669059753418,43.744250828740604],[-79.40849304199219,43.75317916384933]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i3zzzlof8","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"York Mills"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.41201210021973,43.71429397960517],[-79.37905311584473,43.72117979887179],[-79.3773365020752,43.71106791821883],[-79.37338829040527,43.70095433121613],[-79.39621925354004,43.696176153756106],[-79.39664840698242,43.69841015425019],[-79.40317153930664,43.697975771783746],[-79.40617561340332,43.69884453356974],[-79.40857887268066,43.704677322426235],[-79.40960884094238,43.70585622144371],[-79.41184043884276,43.71199853067152],[-79.41201210021973,43.71429397960517]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i3zyxqqg3","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Yonge and Eglington / Davisville"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.41218376159668,43.71448009323288],[-79.3828296661377,43.72055948722688],[-79.38677787780762,43.729801465657914],[-79.40059661865234,43.7372436331695],[-79.40497398376465,43.73656147298425],[-79.40840721130371,43.75317916384933],[-79.43381309509277,43.73587930502763],[-79.43329811096191,43.73476301342663],[-79.42068099975586,43.737801758449834],[-79.41965103149414,43.733398628766096],[-79.41458702087402,43.71807817642306],[-79.41218376159668,43.71448009323288]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i3zzr8b47","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Armour Heights / Lawrence Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.42557334899902,43.70114048626766],[-79.43338394165039,43.73501108002517],[-79.4205093383789,43.737925785583435],[-79.4198226928711,43.733894772239296],[-79.41484451293945,43.718388345893146],[-79.41218376159668,43.71454213098033],[-79.41192626953125,43.712060570987916],[-79.4098663330078,43.706104407756285],[-79.40857887268066,43.70480141815145],[-79.42557334899902,43.70114048626766]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i40065hsa","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Bathurst"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.43389892578125,43.735941320617556],[-79.44368362426758,43.73122795274118],[-79.47037696838379,43.725459774177835],[-79.46213722229002,43.69313529711951],[-79.4256591796875,43.70114048626766],[-79.43389892578125,43.735941320617556]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i4006so0b","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Lawrence Manor / Lawrence Heights"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.40124034881592,43.64040779226563],[-79.38194990158081,43.644134541272514],[-79.37963247299194,43.63803186910975],[-79.39699172973633,43.63640127924797],[-79.39761400222778,43.63719328556455],[-79.39990997314453,43.636478927387635],[-79.40124034881592,43.64040779226563]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i409rxb01a","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"City Place / Harbourfront"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4292640686035,43.67103791309848],[-79.41462993621826,43.67401781037807],[-79.40978050231934,43.66163164182412],[-79.42441463470459,43.65868217735095],[-79.4292640686035,43.67103791309848]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i409of9g19","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Christie Pitts / Koreatown / Mirvish Village"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.46454048156738,43.635329724674484],[-79.47612762451172,43.65116815004088],[-79.48007583618164,43.66017245119425],[-79.50264930725098,43.65495633091365],[-79.50264930725098,43.652658610372164],[-79.49904441833496,43.65029869776588],[-79.49226379394531,43.6484976494426],[-79.48925971984863,43.64203827340191],[-79.47037696838379,43.63203729252688],[-79.46454048156738,43.635329724674484]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i405wwk9s","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Swansea / Bloor West Village / Old Mill"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.42741870880127,43.63918102014533],[-79.41995143890381,43.64064072085134],[-79.40353631973267,43.640423320866084],[-79.4256591796875,43.6343358019018],[-79.42741870880127,43.63918102014533]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40aa6ud1e","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Liberty Village"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.5351791381836,43.77307711737606],[-79.4476318359375,43.79191518340848],[-79.43887710571289,43.75559702541283],[-79.46514129638672,43.750141199307905],[-79.46943283081055,43.7541091221655],[-79.47406768798828,43.75547303488856],[-79.47715759277344,43.755101061774276],[-79.4809341430664,43.75435710860915],[-79.48282241821289,43.75200119590339],[-79.48316574096678,43.74592499302],[-79.49621200561523,43.742824651868574],[-79.49604034423828,43.740468285206695],[-79.49295043945312,43.73873195568971],[-79.49501037597655,43.73525914559611],[-79.50410842895508,43.73538317799622],[-79.51148986816406,43.73290248118248],[-79.5132064819336,43.73947610307701],[-79.52642440795898,43.73649945803657],[-79.5351791381836,43.77307711737606]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i40682sit","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"York University / Jane and Finch"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.44509983062744,43.65185128228425],[-79.44299697875977,43.65051606201462],[-79.42042350769043,43.65508052951952],[-79.4150161743164,43.64154136955292],[-79.41879272460938,43.64067177792789],[-79.42381381988525,43.64085812004995],[-79.42857742309569,43.642410948591575],[-79.44106578826904,43.63989534619834],[-79.44509983062744,43.65185128228425]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40aekj11f","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"West Queen West / Little Portugal / Dundas West"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.31957244873047,43.768614600741934],[-79.30274963378906,43.72483950684785],[-79.31656837463379,43.726390163130624],[-79.32403564453124,43.724963560827625],[-79.35064315795897,43.71727172828662],[-79.34866905212401,43.7232888104246],[-79.34918403625488,43.72527369465318],[-79.35553550720215,43.731414013769],[-79.37785148620605,43.74400280042086],[-79.38179969787598,43.74908717557835],[-79.3655776977539,43.752807176476544],[-79.3600845336914,43.75299317045196],[-79.36274528503418,43.76669313687161],[-79.31957244873047,43.768614600741934]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i402y4j4j","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Banbury / Don Mills / Parkwoods / Graydon Hall / Victoria Village"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4236421585083,43.629800820648306],[-79.42563772201537,43.63428921136849],[-79.42741870880127,43.63918102014533],[-79.41995143890381,43.64060966375876],[-79.42379236221313,43.64084259156185],[-79.42859888076781,43.642379892414056],[-79.44643020629883,43.638823853934134],[-79.44795370101929,43.636603164202356],[-79.43364143371582,43.630779287335464],[-79.42911386489868,43.62987847731654],[-79.42593812942505,43.62953678722581],[-79.4236421585083,43.629800820648306]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40a7p311d","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Parkdale"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.42563772201537,43.634304741550274],[-79.40332174301147,43.640438849462555],[-79.40126180648804,43.64039226366114],[-79.39990997314453,43.63654104582708],[-79.3976354598999,43.6372088149958],[-79.39557552337646,43.63470852486803],[-79.40239906311035,43.63101225324647],[-79.41143274307251,43.62717596625275],[-79.41636800765991,43.626119779481286],[-79.42031621932983,43.6267100037883],[-79.42256927490234,43.627455541997634],[-79.42563772201537,43.634304741550274]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i409xzpx1c","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Exhibition Place / Fort York"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.3967342376709,43.803747905640506],[-79.34128761291504,43.81582601618893],[-79.31974411010741,43.768614600741934],[-79.36283111572264,43.76675512054052],[-79.3751049041748,43.76582535876258],[-79.38703536987305,43.763283936168335],[-79.3967342376709,43.803747905640506]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i403mk7ln","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Hillcrest / Bayview / Pleasantview"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.3965196609497,43.6747472418566],[-79.39420223236084,43.675259390575334],[-79.39276456832884,43.67476276157897],[-79.38894510269165,43.67567841809408],[-79.38613414764404,43.66878737177564],[-79.39353704452515,43.66728179012687],[-79.3965196609497,43.6747472418566]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i40b2y5i1k","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Yorkville"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4871997833252,43.68748758284681],[-79.45046424865723,43.69580381224848],[-79.43930625915527,43.66905123271143],[-79.44840431213379,43.667312833428774],[-79.45981979370116,43.667219703474935],[-79.4725227355957,43.679821977132995],[-79.4871997833252,43.68748758284681]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i40apjrx1h","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Earlscourt / Silverthorne / Fairbank"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.32025909423828,43.675383547182214],[-79.31648254394531,43.67637679078971],[-79.31098937988281,43.681032401049464],[-79.28661346435547,43.68705312125952],[-79.29622650146484,43.70908256335716],[-79.31296348571777,43.70535984573582],[-79.31922912597656,43.70020970523003],[-79.32944297790527,43.697789606906234],[-79.32025909423828,43.675383547182214]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i4056kz4p","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Woodbine / Crescent Town"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.43870544433594,43.75559702541283],[-79.43398475646973,43.73612736700192],[-79.44376945495605,43.731351993490605],[-79.50736999511719,43.71764393646753],[-79.51972961425781,43.71652730498859],[-79.5230770111084,43.722358373303294],[-79.52651023864746,43.736623487867654],[-79.51346397399902,43.73947610307701],[-79.51174736022949,43.73284046244549],[-79.50393676757812,43.735507210139424],[-79.49509620666504,43.735321161828274],[-79.49295043945312,43.73873195568971],[-79.49586868286133,43.740468285206695],[-79.49621200561523,43.742824651868574],[-79.48333740234375,43.74611100838307],[-79.48290824890137,43.75218719238366],[-79.48084831237793,43.75441910505952],[-79.47423934936523,43.75559702541283],[-79.46934700012207,43.754171118872755],[-79.4652271270752,43.750141199307905],[-79.43870544433594,43.75559702541283]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i406djqpu","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Downsview / Wilson Heights"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.25142288208008,43.83687944380328],[-79.25107955932617,43.830688030025804],[-79.24318313598633,43.81260542552765],[-79.24455642700195,43.80690703195458],[-79.23511505126953,43.78559517821802],[-79.21588897705078,43.7941456139256],[-79.16799545288086,43.80046471499566],[-79.1520309448242,43.79550861381753],[-79.13211822509766,43.806659263379565],[-79.14155960083008,43.81334865417318],[-79.15872573852539,43.831431033595216],[-79.16954040527344,43.85544983098845],[-79.25142288208008,43.83687944380328]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i403evbkl","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Malvern / Morningside / Rouge Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.34137344360352,43.81582601618893],[-79.25133705139159,43.83700326552683],[-79.25125122070312,43.830811864596384],[-79.24335479736328,43.812729297610915],[-79.24481391906738,43.80696897393774],[-79.23528671264648,43.78571910631151],[-79.31330680847168,43.768428655323056],[-79.31974411010741,43.768738564033384],[-79.34137344360352,43.81582601618893]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i403khk8m","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"L'Amoreaux / Agincourt / Steels / Milliken"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.32025909423828,43.67544562538932],[-79.31639671325684,43.676500945084705],[-79.31090354919434,43.68121861794609],[-79.28661346435547,43.68723931946797],[-79.28009033203125,43.67141040835008],[-79.2982006072998,43.66513976352421],[-79.3004322052002,43.66520185232747],[-79.30652618408203,43.66104176052085],[-79.3132209777832,43.65806121899918],[-79.32025909423828,43.67544562538932]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i405gc7bq","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"The Beaches"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4243288040161,43.65865112958589],[-79.40209865570068,43.663121842458715],[-79.40003871917725,43.65796807469251],[-79.4077205657959,43.65650879502444],[-79.4060468673706,43.65241020288565],[-79.41832065582275,43.64986396690839],[-79.42033767700195,43.6549873805892],[-79.42282676696777,43.65449058385389],[-79.4243288040161,43.65865112958589]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i4052blvo","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Little Italy / Harbord Village"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.45037841796875,43.69580381224848],[-79.42548751831055,43.70120253782304],[-79.41475868225098,43.674079889998026],[-79.43926334381104,43.66900466910116],[-79.45037841796875,43.69580381224848]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i40bq6hz1p","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Cedarvale / Wychwood Park / Humewood"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.40656185150145,43.74431283565998],[-79.4022274017334,43.74428183220832],[-79.38184261322021,43.74902517360446],[-79.3778944015503,43.74400280042086],[-79.35540676116943,43.731383003637845],[-79.34922695159912,43.72530470794744],[-79.34871196746826,43.72325779608671],[-79.35085773468018,43.716930535423025],[-79.3548059463501,43.71568981772379],[-79.37737941741943,43.711192000714085],[-79.37905311584473,43.72121081428546],[-79.38278675079346,43.72043542412722],[-79.38677787780762,43.729770454691824],[-79.4005537033081,43.737305647346446],[-79.40497398376465,43.73659248043397],[-79.40656185150145,43.74431283565998]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i4074tazx","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Hogg's Hollow / Bridle Path / Sunnybrook"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.3773365020752,43.711192000714085],[-79.3549346923828,43.71565879945217],[-79.3238639831543,43.72502558772119],[-79.31648254394531,43.72651421389918],[-79.30266380310057,43.72483950684785],[-79.29622650146484,43.70926869316916],[-79.31296348571777,43.70535984573582],[-79.31922912597656,43.700333810203276],[-79.3293571472168,43.69785166192964],[-79.3267822265625,43.69077697561049],[-79.36257362365723,43.682522120039025],[-79.36128616333008,43.685191107385755],[-79.36051368713377,43.68934952543537],[-79.35931205749512,43.69145965716313],[-79.36180114746094,43.69226645261592],[-79.36308860778809,43.69356971465104],[-79.36677932739256,43.694314423098085],[-79.36986923217773,43.696052040177115],[-79.37124252319336,43.696176153756106],[-79.3773365020752,43.711192000714085]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i406yibgw","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Leaside / Thorncliffe Park / Flemingdon Park / Parkview Hills"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4188141822815,43.64068730646014],[-79.3846321105957,43.6478144790543],[-79.38370943069458,43.64565623064505],[-79.38240051269531,43.645330157595865],[-79.38201427459717,43.64415006890975],[-79.40128326416014,43.64039226366114],[-79.4188141822815,43.64068730646014]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i40blfk71o","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"King West"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.47999000549316,43.660234545135005],[-79.4747543334961,43.66129013230231],[-79.47338104248047,43.66209733349594],[-79.46917533874512,43.66302870600273],[-79.46823120117188,43.660607107430906],[-79.45647239685059,43.6632149787702],[-79.4534683227539,43.6600482631201],[-79.44522857666016,43.65185128228425],[-79.4410228729248,43.63986428872045],[-79.44643020629883,43.63880832492028],[-79.44788932800293,43.63663422336588],[-79.45956230163574,43.63688269609634],[-79.46445465087889,43.635205485226905],[-79.4762134552002,43.65129235648128],[-79.47999000549316,43.660234545135005]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i405syrlr","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"High Park / Roncesvalles"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.54032897949219,43.71268097061953],[-79.51981544494629,43.71665137618051],[-79.5077133178711,43.71758190193127],[-79.47037696838379,43.725707879311514],[-79.46230888366699,43.69319735695953],[-79.48737144470215,43.68761171415088],[-79.50119018554688,43.69481089025842],[-79.51372146606445,43.69214233094498],[-79.52101707458496,43.699340963224465],[-79.53243255615234,43.70473937032095],[-79.53603744506836,43.704242985365006],[-79.54032897949219,43.71268097061953]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i40b94ou1m","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"Weston / Pelmo Park / North Park / Keelesdale"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.60324287414551,43.75782881091782],[-79.63105201721191,43.75181519884502],[-79.62667465209961,43.73011157443572],[-79.60075378417969,43.68500490281945],[-79.59302902221678,43.6802875276831],[-79.59234237670897,43.67358325124029],[-79.58650588989258,43.670230832122314],[-79.58135604858398,43.67221747346408],[-79.56933975219725,43.6920802700132],[-79.55268859863281,43.71019933355897],[-79.55474853515625,43.714418055421206],[-79.56642150878906,43.711812409337],[-79.58135604858398,43.71379767377217],[-79.60058212280272,43.75460509402518],[-79.60324287414551,43.75782881091782]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i407e4oyz","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Clairville / West Humber"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.58118438720702,43.672465799008016],[-79.56315994262695,43.67482484042829],[-79.52093124389648,43.68351524548156],[-79.50874328613281,43.68426007877438],[-79.51337814331055,43.6920802700132],[-79.52110290527344,43.6994030166423],[-79.53243255615234,43.70473937032095],[-79.53620910644531,43.704367081989325],[-79.54032897949219,43.71243281153759],[-79.55268859863281,43.71019933355897],[-79.5688247680664,43.69232851335504],[-79.58118438720702,43.672465799008016]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40bw0ts1q","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Richview / Kingsview"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4077205657959,43.65653984389727],[-79.399995803833,43.658030170913015],[-79.39587593078613,43.65871322509997],[-79.39471721649169,43.65582571576046],[-79.3923568725586,43.65632250145034],[-79.39149856567383,43.654335334031266],[-79.38836574554443,43.65492528122204],[-79.38677787780762,43.65085763281612],[-79.40398693084717,43.647224462011316],[-79.4077205657959,43.65653984389727]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i408idik13","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Kensington Market / Chinatown"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.60332870483398,43.75789080377141],[-79.5956039428711,43.75962657759532],[-79.58950996398926,43.759564586540144],[-79.58727836608887,43.76018449420188],[-79.58324432373047,43.76049444562423],[-79.5780086517334,43.76384181866966],[-79.53509330749512,43.77301514025853],[-79.52333450317383,43.72248243242106],[-79.51972961425781,43.71665137618051],[-79.55286026000977,43.710075249008575],[-79.5549201965332,43.714418055421206],[-79.56676483154297,43.712060570987916],[-79.58118438720702,43.713921750615754],[-79.60075378417969,43.75522505306928],[-79.60332870483398,43.75789080377141]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i407hx9f10","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Rexdale / Humber Summit / Humberlea /Kipling Heights / Emery "},"type":"Feature"},{"geometry":{"coordinates":[[[-79.41462993621826,43.67397125062097],[-79.40070390701294,43.676842368071384],[-79.3978500366211,43.678068370965214],[-79.39413785934448,43.668740807960695],[-79.40385818481445,43.666723007947446],[-79.4021201133728,43.663121842458715],[-79.40978050231934,43.66160059558423],[-79.41462993621826,43.67397125062097]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i408w0zu14","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"The Annex"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.55972671508789,43.605256288140474],[-79.5413589477539,43.58424567044839],[-79.53689575195312,43.587602888720276],[-79.51011657714844,43.58635949637695],[-79.4754409790039,43.61432961166741],[-79.46840286254883,43.62253171228931],[-79.47029113769531,43.63197516943179],[-79.47338104248047,43.63346610599048],[-79.48162078857422,43.62799915777916],[-79.5132064819336,43.620916235501824],[-79.54719543457031,43.61470245869565],[-79.55148696899414,43.613086771544474],[-79.55972671508789,43.605256288140474]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40c5pkf1s","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Mimico / Long Branch / Alderwood"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.41462993621826,43.67398677054402],[-79.40072536468506,43.676873406428385],[-79.39789295196533,43.67802181435086],[-79.3965196609497,43.67473172213022],[-79.39424514770508,43.675228351383474],[-79.39278602600098,43.67473172213022],[-79.3888807296753,43.6756628986085],[-79.39411640167236,43.68823236681809],[-79.39501762390137,43.69012531778852],[-79.39669132232665,43.69841015425019],[-79.40308570861816,43.697975771783746],[-79.40621852874754,43.69887556054356],[-79.4086217880249,43.70486346591772],[-79.42553043365479,43.70120253782304],[-79.41462993621826,43.67398677054402]]],"type":"Polygon"},"properties":{"description":"","fill":"#FCEC56","fill-opacity":0.2,"id":"marker-i4091gh715","stroke":"#FCEC56","stroke-opacity":1,"stroke-width":4,"title":"Forest Hill / Casa Loma / Summerhill / Deer Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.40385818481445,43.66670748614599],[-79.39413785934448,43.668740807960695],[-79.39355850219727,43.667250746808946],[-79.38885927200317,43.66825964642422],[-79.38375234603882,43.65584124037548],[-79.39147710800171,43.654273233989805],[-79.39229249954224,43.65629145246512],[-79.39467430114746,43.65579466651838],[-79.39587593078613,43.658666653470405],[-79.40008163452148,43.65795255062737],[-79.40209865570068,43.66315288791194],[-79.40385818481445,43.66670748614599]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i408ep3112","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"University of Toronto / Hospital District"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4602918624878,43.667250746808946],[-79.44827556610107,43.66734387671461],[-79.42930698394775,43.67106895445775],[-79.42291259765625,43.654614783423014],[-79.44295406341553,43.65054711398592],[-79.44522857666016,43.65191338483016],[-79.4602918624878,43.667250746808946]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40d2f3c1x","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Dufferin Grove / Wallace Emmerson / Dovercourt"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.51342105865477,43.66222151733168],[-79.50531005859375,43.662966614951806],[-79.49904441833496,43.66619526444617],[-79.49166297912598,43.66728179012687],[-79.46569919586182,43.673148688955735],[-79.47247982025146,43.67985301394873],[-79.50127601623534,43.69484191931947],[-79.51346397399902,43.69226645261592],[-79.50732707977295,43.6815910500054],[-79.5111894607544,43.675259390575334],[-79.51342105865477,43.66222151733168]]],"type":"Polygon"},"properties":{"description":"","fill":"#fcec56","fill-opacity":0.2,"id":"marker-i40d8bkw1z","stroke":"#fcec56","stroke-opacity":1,"stroke-width":4,"title":"Harwood / Mount Dennis / Lambton"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.28764343261719,43.689597780080135],[-79.27614212036133,43.69183202564382],[-79.26876068115233,43.69654849295177],[-79.2454147338867,43.730793808095065],[-79.22876358032227,43.74158447044938],[-79.22430038452148,43.73066976618957],[-79.21382904052734,43.726700289570324],[-79.22584533691406,43.7134254417],[-79.22584533691406,43.70734532390574],[-79.22996520996092,43.703498400224376],[-79.24352645874023,43.69977533580068],[-79.2557144165039,43.694438540273495],[-79.28009033203125,43.67147249066722],[-79.28764343261719,43.689597780080135]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40czsio1w","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Cliffside / Cliffcrest"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.22876358032227,43.74170848974737],[-79.22086715698242,43.74803313328719],[-79.20181274414062,43.75460509402518],[-79.20438766479492,43.7574568524475],[-79.20249938964844,43.76154826844947],[-79.20146942138672,43.76365585841392],[-79.20284271240234,43.76700305457395],[-79.20095443725586,43.76886252706789],[-79.19855117797852,43.7712177759096],[-79.20112609863281,43.77431664623901],[-79.18670654296875,43.7796463275907],[-79.1810417175293,43.78088572028641],[-79.16988372802734,43.77977026801639],[-79.16284561157227,43.77753930104478],[-79.15306091308594,43.7715896488274],[-79.14842605590819,43.77084590067953],[-79.14327621459961,43.768614600741934],[-79.15220260620117,43.75944060423702],[-79.17022705078125,43.75572101568019],[-79.18670654296875,43.74741309973935],[-79.20164108276367,43.73600333614323],[-79.2140007019043,43.72694838956604],[-79.22447204589844,43.73091784974365],[-79.22876358032227,43.74170848974737]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40dslwq21","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Scarborough Village / West Hill"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.50505256652832,43.66302870600273],[-79.49921607971191,43.66625735215772],[-79.4915771484375,43.667312833428774],[-79.4655704498291,43.673148688955735],[-79.45664405822754,43.66327706956424],[-79.4681453704834,43.66073129434911],[-79.46934700012207,43.66302870600273],[-79.47320938110352,43.66228360915322],[-79.47496891021727,43.66125908588582],[-79.47999000549316,43.660234545135005],[-79.50247764587402,43.655049479892135],[-79.49934482574463,43.65899265411867],[-79.50505256652832,43.66302870600273]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.20000000298023224,"id":"marker-i40ju0m82h","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"The Junction / Warren Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.32137489318846,43.67820804059153],[-79.33678150177002,43.672093310306806],[-79.34094429016113,43.669144359823584],[-79.34244632720946,43.66771639489241],[-79.34510707855225,43.6637117033245],[-79.34600830078125,43.6599240747891],[-79.34635162353516,43.6566950880206],[-79.3472957611084,43.6552668269467],[-79.34939861297607,43.65380748163211],[-79.34703826904295,43.65119920167507],[-79.32849884033203,43.65924103437689],[-79.3148946762085,43.66225256325049],[-79.32137489318846,43.67820804059153]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40eni2228","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Leslieville"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.38581228256226,43.66083995769185],[-79.38304424285889,43.66138327145546],[-79.38164949417114,43.66138327145546],[-79.37313079833984,43.663199456061655],[-79.37231540679932,43.66125908588582],[-79.36813116073608,43.662143902464436],[-79.36705827713013,43.66200419545055],[-79.3644618988037,43.65565494473033],[-79.3792676925659,43.65253440675735],[-79.38083410263062,43.65640012384311],[-79.38375234603882,43.65579466651838],[-79.38581228256226,43.66083995769185]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i40fvxtf2g","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"Ryerson / College Park / Moss Park"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.1970920562744,43.79680963016839],[-79.1905689239502,43.77834493760914],[-79.1865348815918,43.779894208185176],[-79.18095588684082,43.78094768924676],[-79.16996955871582,43.78001814809708],[-79.16250228881836,43.77753930104478],[-79.15288925170898,43.771465691445044],[-79.14842605590819,43.770783921249716],[-79.14327621459961,43.768614600741934],[-79.1403579711914,43.76917243353017],[-79.11993026733398,43.789746629487276],[-79.11709785461426,43.7939597478953],[-79.13246154785156,43.80672120561967],[-79.1521167755127,43.795632521357085],[-79.16799545288086,43.80058861225811],[-79.1970920562744,43.79680963016839]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40dvk2i22","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Highland Creek / Centennial / Rouge Hill"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.4476318359375,43.792039098398824],[-79.39647674560547,43.80380985089954],[-79.38712120056152,43.763345923369855],[-79.39501762390137,43.761796224063694],[-79.43381309509277,43.73600333614323],[-79.4476318359375,43.792039098398824]]],"type":"Polygon"},"properties":{"description":"","fill":"#47c2d6","fill-opacity":0.2,"id":"marker-i40efntd27","stroke":"#47c2d6","stroke-opacity":1,"stroke-width":4,"title":"North York / Willowdale / Lansing"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.23511505126953,43.78571910631151],[-79.2454147338867,43.78348836131966],[-79.22893524169922,43.7416464801305],[-79.22121047973633,43.748095136288704],[-79.20172691345215,43.754667090218604],[-79.20438766479492,43.757394859144306],[-79.20146942138672,43.76371784523008],[-79.20284271240234,43.76700305457395],[-79.19872283935545,43.77140371265752],[-79.20112609863281,43.77437862200773],[-79.1905689239502,43.77834493760914],[-79.1970920562744,43.796747677651126],[-79.21597480773926,43.794269524291316],[-79.23511505126953,43.78571910631151]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40e4isx23","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Morningside / Woburn "},"type":"Feature"},{"geometry":{"coordinates":[[[-79.36162948608398,43.675880171040994],[-79.34480667114258,43.679046051522036],[-79.34094429016113,43.6692995713561],[-79.34240341186523,43.667871610117494],[-79.34514999389648,43.66383588382089],[-79.34609413146973,43.6599240747891],[-79.34635162353516,43.6566950880206],[-79.34720993041992,43.6552668269467],[-79.34944152832031,43.6537764313465],[-79.35407638549805,43.65868217735095],[-79.35733795166016,43.6697341615118],[-79.36102867126465,43.67401781037807],[-79.36162948608398,43.675880171040994]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40eqjoq29","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Riverside / Riverdale"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.3792676925659,43.652503355813494],[-79.3693971633911,43.654614783423014],[-79.36641454696655,43.64731762298236],[-79.37628507614136,43.64506619240255],[-79.3792676925659,43.652503355813494]]],"type":"Polygon"},"properties":{"description":"","fill":"#57dfc9","fill-opacity":0.2,"id":"marker-i40fpji32f","stroke":"#57dfc9","stroke-opacity":1,"stroke-width":4,"title":"St. Lawrence"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.57019805908203,43.67401781037807],[-79.56324577331543,43.67501107659091],[-79.52033042907713,43.683763524273346],[-79.50891494750977,43.68438421675744],[-79.50745582580566,43.6815910500054],[-79.51106071472168,43.675259390575334],[-79.5135498046875,43.66222151733168],[-79.50531005859375,43.66309079698946],[-79.49930191040038,43.65899265411867],[-79.50247764587402,43.655018430248695],[-79.50264930725098,43.652658610372164],[-79.49904441833496,43.6503608019172],[-79.49217796325684,43.64855975545622],[-79.48925971984863,43.642100386094036],[-79.47338104248047,43.63371459182088],[-79.48166370391846,43.62803022138959],[-79.51346397399902,43.620916235501824],[-79.52659606933592,43.650919736389504],[-79.52964305877686,43.65123025329318],[-79.53886985778809,43.65411798360529],[-79.54397678375244,43.65237915187759],[-79.55243110656738,43.6563535504195],[-79.55260276794434,43.65806121899918],[-79.55324649810791,43.65902370170714],[-79.55599308013916,43.65837169897778],[-79.56320285797119,43.66246988423254],[-79.5677089691162,43.666102132758425],[-79.57019805908203,43.67401781037807]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40fijw42e","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Humber Valley / Humber Bay"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.37686443328857,43.67245027869163],[-79.37064170837402,43.67210883071551],[-79.36673641204834,43.67477828129731],[-79.36160802841187,43.67586465160763],[-79.361093044281,43.674079889998026],[-79.35729503631592,43.66970311946217],[-79.35587882995605,43.66462752844683],[-79.36705827713013,43.66197314940332],[-79.36819553375244,43.66211285648944],[-79.3722939491272,43.66124356267156],[-79.37315225601196,43.663199456061655],[-79.37686443328857,43.67245027869163]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40f3o5e2c","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Cabbagetown / St. James Town"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.31974411010741,43.76886252706789],[-79.31304931640625,43.768614600741934],[-79.2454147338867,43.78361229378082],[-79.22893524169922,43.74158447044938],[-79.24507141113281,43.73091784974365],[-79.24833297729492,43.73711960462295],[-79.30274963378906,43.72508761455053],[-79.31974411010741,43.76886252706789]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40ea5iy25","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Bendale / Wexford Heights"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.35961246490479,43.645702812364746],[-79.32837009429932,43.65930312928092],[-79.31485176086426,43.662314655039914],[-79.31300640106201,43.65790597840785],[-79.31721210479736,43.65483213205091],[-79.32154655456543,43.63896361487832],[-79.34733867645264,43.63287594802549],[-79.35124397277832,43.63464640453417],[-79.35961246490479,43.645702812364746]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40etk4a2a","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Cherry Beach "},"type":"Feature"},{"geometry":{"coordinates":[[[-79.30274963378906,43.725149641315625],[-79.24833297729492,43.73718161892833],[-79.24524307250977,43.73104189113534],[-79.26876068115233,43.69679671779774],[-79.27631378173828,43.69183202564382],[-79.28772926330566,43.689659843580785],[-79.30274963378906,43.725149641315625]]],"type":"Polygon"},"properties":{"description":"","fill":"#A693c5","fill-opacity":0.2,"id":"marker-i40ebffm26","stroke":"#A693c5","stroke-opacity":1,"stroke-width":4,"title":"Kennedy Park / Oakridge / Clairlea"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.58101272583008,43.672652042491684],[-79.58650588989258,43.67047916588633],[-79.58805084228516,43.6656364721523],[-79.60916519165039,43.64682076280055],[-79.60744857788086,43.64458484112279],[-79.59637641906738,43.64328051504386],[-79.59148406982422,43.64458484112279],[-79.58556175231934,43.6381250443368],[-79.58581924438477,43.629179563690386],[-79.57775115966797,43.625886794606906],[-79.56393241882324,43.627750648317644],[-79.56384658813477,43.62470632403159],[-79.56676483154297,43.62085410091236],[-79.56865310668945,43.61414318728641],[-79.56719398498535,43.60892306998401],[-79.55955505371094,43.60513198653391],[-79.55122947692871,43.61283820043768],[-79.54736709594727,43.614516035470494],[-79.51346397399902,43.62104050448816],[-79.52642440795898,43.650795529178524],[-79.52960014343262,43.65116815004088],[-79.53895568847656,43.65408693348021],[-79.54401969909667,43.65234810085349],[-79.55251693725586,43.65632250145034],[-79.55251693725586,43.65799912281079],[-79.5531177520752,43.65899265411867],[-79.55595016479492,43.6583096031105],[-79.56324577331543,43.66246988423254],[-79.5677089691162,43.66607108883039],[-79.57019805908203,43.67383157113291],[-79.58101272583008,43.672652042491684]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40f9lfu2d","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Eringate / Islington / Six Points"},"type":"Feature"},{"geometry":{"coordinates":[[[-79.36244487762451,43.68258419086083],[-79.32665348052977,43.69077697561049],[-79.32146072387695,43.67817700292489],[-79.3368673324585,43.67212435112022],[-79.34094429016113,43.66920644448475],[-79.34489250183105,43.679046051522036],[-79.36167240142822,43.675880171040994],[-79.36244487762451,43.68258419086083]]],"type":"Polygon"},"properties":{"description":"","fill":"#FF8272","fill-opacity":0.2,"id":"marker-i40eyxsj2b","stroke":"#FF8272","stroke-opacity":1,"stroke-width":4,"title":"Danforth / Greek Town"},"type":"Feature"}],"id":"apartmate.ki4lhef7","ids":["ci3zfkakj00rkkaqq2thp0coh","ci3zfkaks00rrkaqqrhvgeyl4","ci3zfkal700s5kaqqusbv6jnk","ci3zfkalb00s8kaqqv9h81gph","ci3zfkale00sakaqq5sv9wnie","ci3zfkalf00sbkaqqnk4zqoli","ci3zfkalk00sgkaqqc6auelyo","ci3zfkalp00skkaqqkr1abgrj","ci40k0j9600uzjms1okzhf545","ci40k0j9700v0jms1neocdd9m","ci40k0j9800v1jms18yz1qma0","ci40k0j9900v2jms1lu61uz6l","ci40k0j9b00v3jms1s897hbbt","ci40k0j9c00v4jms1xsq78b1n","ci40k0j9d00v5jms1cv07kh24","ci40k0j9e00v6jms1qjis16ro","ci40k0j9f00v7jms1vst63csc","ci40k0j9h00v8jms10ujlgkkq","ci40k0j9i00v9jms1yrzad8w5","ci40k0j9j00vajms1qoquilu8","ci40k0j9k00vbjms16wi1pdyo","ci40k0j9l00vcjms1ye9pa46j","ci40k0j9m00vdjms150p1hdob","ci40k0j9n00vejms1cv5c8pvu","ci40k0j9p00vfjms18rbxmuzu","ci40k0j9q00vgjms1don6fgce","ci40k0j9r00vhjms114xwdn2e","ci40k0j9s00vijms1ydr5xv18","ci40k0j9t00vjjms1adnz9up0","ci40k0j9u00vkjms16r80ru5q","ci40k0j9v00vljms17o9126bh","ci40k0j9w00vmjms1n6zrgk34","ci40k0j9y00vnjms1egnjc1fl","ci40k0j9z00vojms1xrxv3u8j","ci40k0ja000vpjms1h1r12t4q","ci40k0ja100vqjms17885aqcs","ci40k0ja200vrjms1543flx0i","ci40k0ja300vsjms1cu60w6c0","ci40k0ja400vtjms1wd3fn12g","ci40k0ja600vujms1vse5m6lf","ci40k0ja700vvjms102i2quu9","ci40k0ja800vwjms1i24lmgm2","ci40k0ja900vxjms16to0l1i1","ci40k0jaa00vyjms12b1udx6q","ci40k0jab00vzjms1axnd5du6","ci40k0jac00w0jms1hle38o6a","ci40k0jae00w1jms1dcjx0zwn","ci40k0jaf00w2jms1egy5u6un","ci40k0jag00w3jms1jmhld871","ci40k0jah00w4jms1k8km6zwl","ci40k0jai00w5jms1bruuhjl7","ci40k0jaj00w6jms10el8sj6k","ci40k0jak00w7jms1zouuq5h9","ci40k0jam00w8jms1wnlhmh9x","ci40k0jan00w9jms10kl5lcxd","ci40k0jao00wajms11b8a0r4x","ci40k0jap00wbjms1px6a36a3","ci40k0jaq00wcjms1epf2b2di","ci40k0jar00wdjms1slrumgrc","ci40k0jas00wejms1nyaf5sc2","ci40k0jau00wfjms1tt5hvovl","ci40k0jav00wgjms1rby9ika4","ci40k0jaw00whjms1sozr77br","ci40k0jax00wijms1qq3sem4k","ci40k0jay00wjjms10pxlawcl"],"type":"FeatureCollection"};
            

            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);

            console.log('$rootScope.propertyType: ' + $rootScope.propertyType);
            if ($rootScope.propertyType && ($rootScope.propertyType === 'Entire' || $rootScope.propertyType === 'Shared'))
            {
                $scope.filterParameters.propertyType = $rootScope.propertyType;
                //$rootScope.propertyType = '';

            }

            if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
            {
              console.log('User is logged in: ' + $rootScope.user.emailAddress);
              $scope.user = $rootScope.user;
              $scope.$emit('loginEventEmit', {user: $rootScope.user});
              $scope.$emit('FBLoginEventEmit', {user: $rootScope.user});
              $scope.loggedIn = true;
            } else {
                console.log('$rootScope.user not logged in ');
            }
            getPropertyListingsByFilter();

            if ($scope.selectedNeighbourhoods && $scope.selectedNeighbourhoods.length > 0)
            {
              geojson.eachLayer(function (layer) {  
                  for (var i = 0; i < $scope.selectedNeighbourhoods.length; i++)
                  {
                      //console.log('each id: ' + $scope.selectedNeighbourhoods[i].feature.properties.id)
                      if(layer.feature.properties.id == $scope.selectedNeighbourhoods[i].feature.properties.id) {    
                          //layer.setStyle({fillColor :'blue'}) 
                          layer.setStyle({
                              weight: 4,
                              opacity: 0.8,
                              fillOpacity: 0.60000000298023224
                          });

                          //info.update(layer.feature.properties);

                          if (!L.Browser.ie && !L.Browser.opera) {
                              layer.bringToFront();
                          }

                          //$scope.selectedNeighbourhoods.push(layer);
                          //$scope.filterParameters.selectedGeometry.push({'geometry': layer.feature.geometry, '_id': layer.feature.properties.id});
                          //console.log("$scope.filterParameters.selectedGeometry length: " + $scope.filterParameters.selectedGeometry.length);
                          refreshListings(layer.feature.geometry, layer.feature.properties.id);
                          //refreshListings(layer.feature.geometry, layer.feature.properties.id);
                          //console.log('Neighbourhood count after add: ' + $scope.filterParameters.selectedGeometry.length);
                          $scope.selectedNeighbourhoodsCount++;
                      }
                  }
                
               });
            }
            //markers = new L.LayerGroup();
            //thisMap = map;
            //geojsonLayer.addTo(map);

            //L.GeoIP.centerMapOnPosition(map, 15);
        });

        leafletData.getMap().then(function(map)
        {
            info.addTo(map);
        });
    }
    
   
    initializeLeaflet();

    function drawHoverMarker(lat, lon, _id) {
        $scope.markers[_id].icon = $scope.iconHover;
        $scope.markers[_id].opacity = 1;
    }

    function drawMarker(lat, lon, _id, title, img, price, propertyType) {
        leafletData.getMap().then(function(map) 
        {
           
            var listingIcon = new ListingIcon();

            var m1 = {
                lat: lat,
                lng: lon,
                message: "<a href= ' " + baseUrl + "/property/" + _id + "' class='markerPopup'><div class='row'><img src='" + img + "' width='250' height='170'></div><div class='propertyPriceBg propertyPriceCustom'></div><span>$</span><h4>" + price + "</h4><h6 class='apartment'>" + propertyType + " Apartment: </h6><h6>" + title + "<h6></a>",
                icon: {},
                opacity: 1
            };

            m1.icon = $scope.iconDefault;
            $scope.markers[_id] = m1;

        });



    }

    function hideHoverMarker(lat, lon, _id)
    {
        $scope.markers[_id].icon = $scope.iconDefault;
    }

    function highlightFeature(e) {
        var layer = e.target;
        var neighborhoodSelected = false;

        for (var i = 0; i < $scope.selectedNeighbourhoods.length; i++)
        {
            if ($scope.selectedNeighbourhoods[i].feature.properties.id == layer.feature.properties.id)
            {
                neighborhoodSelected = true;
            }
        }

        if (neighborhoodSelected === false)
        {
            layer.setStyle({
                weight: 3,
                color: layer.feature.properties.stroke,
                opacity: 0.5,
                dashArray: '',
                fillOpacity: 0.30000000298023224
            });

            info.update(layer.feature.properties);

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        } else {
            info.update(layer.feature.properties);
        }

        
    }

    function resetHighlight(e) {

        var layer = e.target;
        var neighborhoodSelected = false;

        for (var i = 0; i < $scope.selectedNeighbourhoods.length; i++)
        {
            if ($scope.selectedNeighbourhoods[i].feature.properties.id == layer.feature.properties.id)
            {
                neighborhoodSelected = true;
            }
        }

        if (neighborhoodSelected === false)
        {
            geojson.resetStyle(e.target);
            info.update();
        }
    }

    function toggleNeighbourhood(e)
    {
        console.log('toggleNeighbourhood');
        var layer = e.target;
        var neighborhoodSelectedAlready = false;
        //console.log('$scope.selectedNeighbourhoods.length: ' + $scope.selectedNeighbourhoods.length);
        //console.log('$scope.selectedNeighbourhoodProperties.length;: ' + $scope.selectedNeighbourhoodProperties.length);
        
        for (var i = 0; i < $scope.selectedNeighbourhoods.length; i++)
        {

            //console.log("$scope.filterParameters.selectedGeometry length: " + $scope.filterParameters.selectedGeometry.length);
            
            if ($scope.selectedNeighbourhoods[i].feature.properties.id === layer.feature.properties.id)
            {
                neighborhoodSelectedAlready = true;

                console.log('layer.feature.properties.id: ' + layer.feature.properties.id);
                //console.log('$scope.filterParameters.selectedGeometry id: ' + $scope.filterParameters.selectedGeometry[i]._id);
                $scope.selectedNeighbourhoods.splice(i, 1);
                $scope.filterParameters.selectedGeometry.splice(i, 1);
                
            }
        }

        //console.log("$scope.filterParameters.selectedGeometry length: " + $scope.filterParameters.selectedGeometry.length);
        //console.log('neighborhoodSelectedAlready: ' + neighborhoodSelectedAlready);

        if (neighborhoodSelectedAlready === true)
        {
            console.log('neighborhoodSelectedAlready');
            geojson.resetStyle(e.target);
            info.update();
            for (var i = 0; i < $scope.selectedNeighbourhoodProperties.length; i++)
            {
                //console.log('layer.feature.properties.id: ' + layer.feature.properties.id);
                //console.log('$scope.selectedNeighbourhoodProperties[i].propertyID: ' + $scope.selectedNeighbourhoodProperties[i].propertyID);
                if ($scope.selectedNeighbourhoodProperties[i].propertyID === layer.feature.properties.id)
                {
                    //console.log('Removing: ' + $scope.selectedNeighbourhoodProperties[i].propertyID);
                    $scope.selectedNeighbourhoodProperties.splice(i, 1);

                    //$scope.filterParameters.selectedGeometry.splice(i, 1);

                    
                }
            }


            $scope.selectedNeighbourhoodsCount--;
            //console.log('Neighbourhood count after removal: ' + $scope.filterParameters.selectedGeometry.length);
            //console.log('$scope.selectedNeighbourhoodsCount: ' + $scope.selectedNeighbourhoodsCount);
            //console.log('$scope.selectedNeighbourhoodProperties count after removal: ' + $scope.selectedNeighbourhoodProperties.length);
            removeMarkers();
            console.log('$scope.filterParameters.selectedGeometry.length: ' + $scope.filterParameters.selectedGeometry.length);
            if ($scope.selectedNeighbourhoodsCount > 0)
            {
                
                refreshListings(layer.feature.geometry, layer.feature.properties.id);
            }
            else
            {
                console.log('$scope.selectedNeighbourhoodsCount is ' + $scope.selectedNeighbourhoodsCount);
                //if (!$scope.allNeighbourHoodProperties || $scope.allNeighbourHoodProperties.length < 0)
                if($scope.filterParameters.selectedGeometry.length === 0 && returning === true)
                {
                    getPropertyListingsByFilter();
                } else {
                    renderProperties($scope.allNeighbourHoodProperties);
                }
                
            }
        } else {

            layer.setStyle({
                weight: 4,
                opacity: 0.8,
                fillOpacity: 0.60000000298023224
            });

            info.update(layer.feature.properties);

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }

            $scope.selectedNeighbourhoods.push(layer);
            $scope.filterParameters.selectedGeometry.push({'geometry': layer.feature.geometry, '_id': layer.feature.properties.id});
            refreshListings(layer.feature.geometry, layer.feature.properties.id);
            $scope.selectedNeighbourhoodsCount++;
        }
        
    }


    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: toggleNeighbourhood
        });
    }

    

    info.onAdd = function (map) {
        if (!this._div)
        {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            console.log('this._div: ' + this._div);
            //this.clean();
        
        }
        return this._div;
        this.update();
        
    };


    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        if (props)
            this._div.innerHTML = ('<div class="content"><h4>Neighbourhood</h4>' +  props.title + '</div>');


    };

    $scope.changeMarkerOn = function(property)
    {

        drawHoverMarker(property.location.lat, property.location.lon, property._id);
    };

    $scope.changeMarkerOff = function(property)
    {
        //console.log('property off:' + property.lon);
        hideHoverMarker(property.location.lat, property.location.lon, property._id);
    };


    function getPropertyListingsByFilter()
    {
        console.log("getPropertyListingsByFilter");
        //var us = $cookieStore.get('user');
        //console.log('us user: ' + us.emailAddress);
        console.log("Property Type: " + $scope.filterParameters.propertyType);
        var aggregatedProperties = new Array();
        var combinedProperties = new Array();
        try {
            removeMarkers();
            
            console.log($scope.filterParameters);
            // $scope.filterParameters.basementApartment = '';
            // Aggregated

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                //renderProperties(res.properties);
                // aggregatedProperties =res.properties;
                console.log("TESTSTS");
                console.log(res.properties);


                renderProperties(res.properties);                    

                //$scope.allNeighbourHoodProperties = res.properties;    
                // renderProperties(res.properties);
                $scope.allNeighbourHoodProperties = res.properties;

            },
            function(err) {
                $rootScope.error = err.message;
            });

            // Get Listings from Apartmate Users
            
        }
        catch(err) {
            $rootScope.error = err.message;
        }


    };
    
   
    function refreshListings(_geometry, _propertyID)
    {
        console.log("Here")
        console.log($scope.filterParameters);
        if($rootScope.user.emailAddress == '')
          console.log("works");

        try {
            removeMarkers();
            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
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
        console.log(_properties);
        // bedrooms: 'ALL',
        // price: 'ALL',
        // availabilityDate: 'ALL',
        // selectedGeometry: 'ALL',
        // propertyType: 'ALL'
        $scope.originalPropertiesArray = _properties;
        $scope.properties = new Array();

        var currentDate = new Date();
        for(key in _properties){

          if( _properties[key].addedProfileImages.length > 0 ){
            if(typeof _properties[key].addedProfileImages[0].url === "undefined"){
              _properties[key].thumb = "";
            } else {
              var url = _properties[key].addedProfileImages[0].url.split('upload/');
              _properties[key].thumb = url[0] + 'upload/w_400,h_400,c_fill,g_face/' + url[1];        
            }
          }

          if( _properties[key].addedImages.length > 0 ){
            if(typeof _properties[key].addedImages[0].url === "undefined") {
              _properties[key].propertythumb = "";
            } else {
              var url2 = _properties[key].addedImages[0].url.split('upload/');
              _properties[key].propertythumb = url2[0] + 'upload/w_500/' + url2[1]; 
            }
          } 

          if(typeof _properties[key].fbBoostedExpired != "undefined"){
            _properties[key].fbExpired = true;
            if( currentDate > new Date(_properties[key].fbBoostedExpired) ){
              _properties[key].fbExpired = false;
            }
          }

        }
        
        $scope.properties = _properties;
        $rootScope.propertiesGlobal = $scope.properties;
        renderMarkers(_properties);

    }



    // Roommate Pages

    getApartmates();
    
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

    $scope.onDateFilterSelectApartmate = function(_dateFilter)
    { 

        // $scope.formattedAvailableDate = formatDate(_dateFilter);

        try {
            
            $scope.filterParameters.availabilityDate = new Date(_dateFilter); 

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                renderApartmates(res.apartmates);
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }



    $scope.onLeaseTermFilterSelect = function(_leaseTerm)
    {
        try {

            $scope.filterParameters.leaseTerm = _leaseTerm;
            
            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress 
            },
            function(res) {
                renderApartmates(res.apartmates);

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

    $scope.onAgeGroupSelect = function(_ageGroup)
    {
        try {

            $scope.filterParameters.age = _ageGroup;
            
            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress 
            },
            function(res) {
                renderApartmates(res.apartmates);

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


    $scope.onBudgetFilterSelect = function()
    { 
        try {
            $scope.filterParameters.budget = $scope.budgetRange;

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress 
            },
            function(res) {
                renderApartmates(res.apartmates);

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

    $scope.onDateAvailableSelect = function()
    {   
        try {

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress 
            },
            function(res) {
                renderApartmates(res.apartmates);

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
  

    $scope.onGenderFilterSelect = function(_gender)
    {
        try {

            $scope.filterParameters.gender = _gender;
            $scope.selectedGender = _gender;
            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                renderApartmates(res.apartmates);
            
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.onViewApartmateSelect = function(_roommate)
    {
        console.log('onViewApartmateSelect');
        $rootScope.apartmate = _roommate;
        $rootScope.selectedNeighbourhoods = $scope.selectedNeighbourhoods;
        $rootScope.filterParameters = $scope.filterParameters;
        $location.path('/roommate/'+_roommate._id);
        //console.log('$location.path: ' + $location.path);
    }

    function getApartmates()
    {
        try {
            
            console.log('getApartmates');
            //$scope.filterParameters.propertyType = 'Apartmate';

            console.log('$scope.filterParameters gender: ' + $scope.filterParameters.gender);
            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {

                renderApartmates(res.apartmates);
                
                // console.log(res.apartmates);
                // console.log('got me: ' + res.apartmates.length);
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            console.log('err: ' + err);
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
    

    function renderApartmates(_apartmates)
    {
        console.log('renderApartmates');
        console.log(_apartmates);

        
        $scope.apartmates = new Array();
        
        for (var i = 0; i < _apartmates.length; i++)
        {
            var prop = _apartmates[i];
            var daysAgo = 0

            if (prop['addedProfileImages'] && prop['addedProfileImages'] != '' && prop['addedProfileImages'].length > 0)
            {
                var url = prop['addedProfileImages'][0].url.split('upload/');
                prop['addedProfileImages'][0].url = url[0] + 'upload/w_400,h_300,c_fill,g_face/' + url[1];

                if (prop['updatedAt'] && prop['updatedAt'] != '')
                {
                    daysAgo =  Math.floor(( Date.now() - Date.parse(prop['updatedAt']) ) / 86400000);
                } 


                if (!prop['displayName'] || prop['displayName'] == '')
                    prop['displayName'] = prop['personalDescription'];

                var addedAlready = false;

                if (prop['title'] != '')
                {

                    for (var s = 0; s < $scope.apartmates.length; s++)
                    {
                        if ($scope.apartmates[s]._id === prop['_id'])
                        {
                            addedAlready = true;
                        }
                    }
                    //L.marker([lat, lon], {icon: listingIcon}).addTo(map).bindPopup(p);
                    if (addedAlready === false)
                    {
                        
                        if (!prop['phoneNumber'])
                          prop['phoneNumber'] = '';

                        var facebookVerified = false;
                        var linkedInVerified = false;
                        if (prop['provider'].length > 0)
                        {
                            for (var p = 0; p < prop['provider'].length; p++)
                            {
                                if (prop['provider'][p].name === 'facebook')
                                    facebookVerified = true;

                                if (prop['provider'][p].name === 'linkedin')
                                    linkedInVerified = true;
                            }
                        
                        }

                        $scope.apartmates.push({'_id': prop['_id'], 'facebookVerified': facebookVerified, 'linkedInVerified': linkedInVerified, 'emailAddress': prop['emailAddress'], 'phoneNumber': prop['phoneNumber'], 'firstName': prop['firstName'], 'gender': capitalizeFirstLetter(prop['selectedGender']), 'ageGroup': prop['ageGroup'], 'src': prop['addedProfileImages'][0].url, 'daysAgo': daysAgo, 'postDate': prop['createdAt'], 'description': prop['personalDescription'], 'lifestyle': prop['lifestyle'], 'percent': prop['percent'], 'availabilityDate': prop['availabilityDate'], questionsResults: prop['questionsResults'], 'maxRent': prop['maxRent']});
                       // console.log('$scope.properties length: ' + $scope.properties.length);
                       $rootScope.apartmatesGlobal = $scope.apartmates;
                    } else {
                        console.log('apartmate already added');
                    }
                }    
            }

             
        }
        $rootScope.success = "We've got " + $scope.apartmates.length + " listings.";
        // console.log('Filtered: ' + $scope.apartmates.length);
        console.log($scope.apartmates);
        // for (var i = 0; i < $scope.properties.length; i++)
        // {
        //     drawMarker($scope.properties[i].lat, $scope.properties[i].lon, $scope.properties[i]._id);
        // }
    }

    $scope.openSignup = function (size, _status) {

        console.log($rootScope.user);
        if($rootScope.user.emailAddress == ''){
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
            console.log(_user);
            $location.path('/search');
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        } else if(!$rootScope.user.profileCreated) {
          var modalInstance = $modal.open({
            templateUrl: 'initialModal',
            controller: 'InitialModalCtrl',
            size: 'lg',
            resolve: {
              status: function () {
                return true;
              }
            }
          });
        } else {
          // Future: Show percentage matching
        }
        
    };

    // TODO
    $scope.applyFilters = function() {
      if($scope.moreFilters){
        // send filterParamters for 
        try {

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress 
            },
            function(res) {
                renderApartmates(res.apartmates);
                $scope.showMoreFilters;

                //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });

             
        }
        catch(err) {
            $rootScope.error = err.message;
        }

      } else if ($scope.moreFiltersApartmate) {
        // send filterParamters
      }
    }
    
}]);
