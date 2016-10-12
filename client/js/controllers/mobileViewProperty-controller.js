angular.module('angular-client-side-auth')
.controller('MobileViewPropertyCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'leafletData', 'PropertyListing', '$stateParams',  function($rootScope, $timeout, $scope, $location, $window, leafletData, PropertyListing, $stateParams) {

    $scope.property = new Object();
    var targetID = $stateParams.id;
    
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
              // prop.property = res.property;

              if (prop['createdAt'] && prop['createdAt'] != '' && prop['published'])
              {
                  var formattedPostDate = prop['createdAt'];
                  formattedPostDate = formattedPostDate.replace(/-/g, "/");
                  formattedPostDate = formattedPostDate.replace(/T.*$/, "");
                  formattedPostDate = Date.parse(formattedPostDate);
                  // prop['createdAt'] = formattedPostDate;
                  prop.daysAgo = Math.floor((Date.now() - formattedPostDate) / 86400000);
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
        $scope.property = $rootScope.property;
        
        // Phone
        if ($scope.property.phone && $scope.property.phone === '')
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
            $scope.property.couplesTag = $scope.property.couples;
        }

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

    

}]);

