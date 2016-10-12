angular.module('angular-client-side-auth')
.controller('ViewFavoritePropertyCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'leafletData', 'PropertyListing', '$modal', 'Auth', '$stateParams', 'baseUrl', function($rootScope, $timeout, $scope, $location, $window, leafletData, PropertyListing, $modal, Auth, $stateParams, baseUrl) {

    $scope.property = new Object();

    var targetID = $stateParams.id;
    // var targetID = $location.search()['id'];
    // targetID = targetID.substring(0, targetID.length - 1);
    console.log('targetID: ' + targetID);

    $scope.property.petsTag = null;
    $scope.property.couplesTag = null;

    $scope.tagsIcon_bed_disabled = '';

    $scope.img_contactEmail = '';
    $scope.img_contactPhone = '';

    $scope.emailMessage = 'Email';
    $scope.phoneMessage = '    Phone';

    $scope.emailSent = false;
    $scope.selectedContactInformation = '';
    $scope.phoneSelected = null;
    $scope.emailSelected = false;

    $scope.selectedPropertyImage = '';
    $scope.selectedPropertyIdx = 0;

    $scope.loggedIn = false;
    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      $scope.user = $rootScope.user;
      //$scope.$emit('FBLoginEventEmit', {user: $rootScope.user});
      $scope.loggedIn = true;
    } else {
        console.log('User is not logged in');
    }

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


    function initPropertyListing(){
      $scope.property = $rootScope.property;
        console.log($scope.property);

        if($scope.property.bedroom == "Studio/Bachelor"){
            $scope.property.bedroom = "Studio/ Bachelor";
        }

        // Phone
        if (!$scope.property.phone || $scope.property.phone === '')
        {
            $scope.phoneMessage = '';
        } else {
            if ($scope.property.phone.indexOf('-') != -1 && $scope.property.phone.indexOf('(') != -1 )
            {
              $scope.property.phone = $scope.property.phone.replace(/-/g , "").replace("(", "").replace(")", "");
            } else if ($scope.property.phone.indexOf('-') != -1)
            {
              $scope.property.phone = $scope.property.phone.replace(/-/g , "")
            } else if ($scope.property.phone.indexOf('(') != -1 )
            {
              $scope.property.phone = $scope.property.phone.replace("(", "").replace(")", "");
            }
        }

        // Pets
        if ($scope.property.pets && $scope.property.pets != '')
        {
            $scope.property.petsTag = $scope.property.pets;
            console.log('$scope.property.petsTag: ' + $scope.property.petsTag);
        }

        // Couples
        if ($scope.property.couples && $scope.property.couples != '')
        {
            if($scope.property.couples = "N/A")
                $scope.property.couples = "Not Specified";

            $scope.property.couplesTag = $scope.property.couples;
        }

        // Temporary Fix: Remove double image loading
        if($scope.property.allImages.length > 1){
          if($scope.property.allImages[0].url == $scope.property.allImages[1].url){
            $scope.property.allImages.shift();
          }
        }
        
        //console.log('all images length: ' + $scope.property.allImages);
        $scope.selectedPropertyImage = $scope.property.allImages[$scope.selectedPropertyIdx].url;


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
                lat: $scope.property.lat,
                lng: $scope.property.lon,
                zoom: 15
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

        leafletData.getMap().then(function(map) 
        {
           
            //var listingIcon = new ListingIcon();

            var m1 = {
                lat: $scope.property.lat,
                lng: $scope.property.lon,
                icon: {},
                opacity: 1
            };

            m1.icon = $scope.iconDefault;
            $scope.markers[$scope.property._id] = m1;

        });

    }

    if (!$rootScope.property)
    {
        console.log('rootscope property is still empty');
        try {
            

          $rootScope.targetID = targetID;


          Auth.getPropertyById({
              propertyId: targetID
          },
          function(res) {
              console.log(res);
              var prop = res.property;
              prop.property = res.property;

              if (prop['publishedAt'] && prop['publishedAt'] != '' && prop['published'])
              {
                  var formattedPostDate = prop['publishedAt'];
                  formattedPostDate = formattedPostDate.replace(/-/g, "/");
                  formattedPostDate = formattedPostDate.replace(/T.*$/, "");
                  formattedPostDate = Date.parse(formattedPostDate);
                  prop['publishedAt'] = formattedPostDate;
                  prop.daysAgo = Math.floor(( Date.now() - formattedPostDate) / 86400000);
              } 

              prop.lat = prop['location'].lat;
              prop.lon = prop['location'].lon;
              prop.price = prop['rentAmount'];
              prop.allImages = prop['addedImages'];
              prop.bathroom = prop['bathrooms'];
              prop.bedroom = prop['bedrooms'];
              if (prop['petsWelcome'] && prop['petsWelcome'].length > 0 ){
                prop.petsTag = prop['petsWelcome'][0].name;
              }
              $rootScope.property = prop;
              console.log($rootScope.property);

              initPropertyListing();
              $rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
          },
          function(err) {
              $rootScope.error = err.message;
          });    
        }
        catch(err) {
            $rootScope.error = err.message;
        }

       
    } else {
      initPropertyListing();
    }


    $scope.socialClick = function(_social)
    {
        var link = ''
        if (_social == 'twitter')
            link = '//twitter.com/apartmatecanada'

        if (_social == 'fb')
            link = '//www.facebook.com/ApartmateCanada'

        $window.open(link);
    }

    $scope.onEmailApartmateClick = function()
    {
        var link = "mailto:info@apartmate.ca"
                 + "?subject=New%20email " + escape('From View Property Page');

        window.location.href = link;

    }

    $scope.onPhoneClick = function()
    {
        $scope.phoneSelected = true;
        $scope.selectedContactInformation = $scope.property.phone;
        $scope.phoneMessage = '       ' + $scope.property.phone;

        console.log("$scope.property.phone: " + $scope.property.phone);
    }

    $scope.onEmailClick = function()
    {
        if ($scope.emailSelected === false)
        {
            $scope.emailSelected = true;
            $scope.emailMessage = $scope.property.email;
            //$scope.phoneMessage = '          ' + $scope.phoneMessage;
            $scope.sendEmail($scope.property.email, $scope.property.title, '');
        }

    }

    $scope.sendEmail = function(email, subject, body) {

        $scope.selectedContactInformation = $scope.property.email;

        var link = "mailto:"+ email
                 + "?subject=New%20email " + escape(subject);

        window.location.href = link;
     };

    $scope.changeSelectedImage = function(image)
    {
        if ($scope.selectedPropertyImage !== image.url)
        {
            $scope.selectedPropertyImage = image.url;
        }
    }

    $scope.clickThrough = function()
    {
        $scope.selectedPropertyIdx++;
        $scope.selectedPropertyImage = $scope.property.allImages[$scope.selectedPropertyIdx].url;
    }
          
    try {


 //console.log('User Id: ' + $scope.user.id);
            // console.log('Street address: ' + $scope.property.streetAddress);
            // console.log('Property Type: ' + $scope.property.propertyTypeSelected);
            // console.log('basementApartment: ' + $scope.property.isBasementApartment);
            // console.log('bedrooms: ' + $scope.property.selectedBathrooms);
            // console.log('bathrooms: ' + $scope.property.selectedBedrooms);
            // //console.log('postalCode: ' + $scope.property.postalCode);
            // console.log('availabilityDate: ' + $scope.property.dt);
            // console.log('leaseTermsAvailable: ' + $scope.property.selectedLeaseTerm);
            // console.log('rentAmount: ' + $scope.property.rentAmount);
            // console.log('electricityIncluded: ' + $scope.property.utilities.electricityIncluded);
            // console.log('utilities: ' + $scope.property.utilities);
            // console.log('petsWelcome: ' + $scope.property.selectedPets);
        //     console.log('featuresIncluded: ' + $scope.property.features);
        // $scope.property.propertyTypeSelected = "Low-rise apartment or condo";
        // $scope.property.isBasementApartment = "No";
        // $scope.property.selectedBathrooms = '1 bathroom';
        // $scope.property.selectedBedrooms = '0 bedrooms (Studio)';
        // $scope.property.selectedLeaseTerm = "Long term lease";
        // $scope.property.selectedPets = "No";
        // $scope.property.landlordType = "Live out landlord";
    } catch(err) {
            $rootScope.error = err.message;
    }
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];



    $scope.getPropertyDetail = function()
    {
        try {

            PropertyListing.getPropertyListing({
                _id: $scope.propertyId

            },
            function(res) {
                console.log('id: ' + res.property._id);
                $rootScope.property = res.property;
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

    // $scope.toggleFavorites = function(){
    //     $scope.property.favoritedByThisUser = !$scope.property.favoritedByThisUser;
    // };

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
        // Every user will have a list of favorite listings.

        // If user is not logged in, it will ask them to login
        // If user is logged in, 
        // It will 
        // - Turn Favorite to true on the property on the local model under $scope.properties
        // - setSelectedStateOf Property to true

        //console.log('toggleFavorite');
        //console.log('$scope.loggedIn: ' + $scope.loggedIn);

        // - it will make a call to /addToFavorites(PropertyID)
        if ($scope.loggedIn === true)
        {
          if (property.favoritedByThisUser === true)
          {
              property.favoritedByThisUser = false;
              // removeFromFavorites();

              // for (var i = 0; i < $scope.properties.length; i++)
              // {
              //   if (property._id === $scope.properties[i]._id)
              //     property.favoritedByThisUser = false;
              // }

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
                  // renderProperties($scope.originalPropertiesArray);
                  //$scope.allNeighbourHoodProperties = res.properties;      
                  //$rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
              },
              function(err) {
                  console.log('err: ' + err);
                  $rootScope.error = err.message;
              });
              
          } else {
             
             property.favoritedByThisUser = true;

             // for (var i = 0; i < $scope.properties.length; i++)
             //  {
             //    if (property._id === $scope.properties[i]._id)
             //      property.favoritedByThisUser = true;
             //  }

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
                  // renderProperties($scope.originalPropertiesArray);
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
        
    };

    $scope.fbShare = function() {
      FB.ui({
        method: 'feed',
        link: baseUrl + '/property/' + $scope.property._id,
        picture: $scope.property.addedImages[0].url,
        caption: $scope.property.title,
        description: $scope.property.description
      }, function(response){
        console.log(response);
      });
    };

}]);


