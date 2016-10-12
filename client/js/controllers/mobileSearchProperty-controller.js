angular.module('angular-client-side-auth')
.controller('MobileSearchPropertyCtrl',
['$rootScope', '$scope', '$location', '$modal', 'PropertyListing', 'ApartmateProfile', function($rootScope, $scope, $location, $modal, PropertyListing, ApartmateProfile) {
    //$scope.loading = true;
    //$scope.userRoles = Auth.userRoles;


    var returning = false;
    if ($rootScope.filterParameters && $rootScope.filterParameters != '')
    {
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
            selectedGeometry: new Array(),
            propertyType: 'ALL',
            basementApartment: 'No',
            bathrooms: 'ALL',
            pets: { 'cats': false, 'dogs': false},
            userMinPrice: $scope.minPrice,
            userMaxPrice: $scope.maxPrice,
            price: {
                minPrice: 650,
                maxPrice: 3000
            }
        };

        $scope.selectedNeighbourhoods = new Array();
    }

    $scope.openFilter = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'filterModal',
          controller: 'FilterModalCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (filterParameters) {
          $scope.filterParameters = filterParameters;
          getPropertiesByTypeFilter();
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    getPropertiesByTypeFilter();

    $scope.$on('mobileFilterEventBroadcast', function(event, args) 
    {
      //getPropertyListingsByFilter();
      $scope.filterParameters = args.filterParameters;
      getPropertiesByTypeFilter();
    });

    // default the user's values to the available range
    $scope.userMinPrice = $scope.filterParameters.userMinPrice;
    $scope.userMaxPrice = $scope.filterParameters.userMaxPrice;

    $scope.checked = false;

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

    $scope.highlightedMarkers = new Array();
    $scope.formattedAvailableDate = formatDate(new Date());
    $scope.test = 'Working';
    $scope.loading = true; 
    //$scope.date = new Date();
    
    $scope.allNeighbourHoodProperties = new Array();
    $scope.selectedNeighbourhoodProperties = new Array();
    $scope.selectedNeighbourhoodsCount = 0;

    $scope.showNumber = 1;

    $scope.home = function()
    {
        $location.path('/');
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
                filterParameters: $scope.filterParameters
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

    $scope.onViewPropertySelect = function(_property)
    {
        console.log('onViewPropertySelect');
        $rootScope.property = _property;
        $rootScope.filterParameters = $scope.filterParameters;
        $rootScope.selectedNeighbourhoods = $scope.selectedNeighbourhoods;
        $location.path('/property/' + _property._id);
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


    $scope.onDateFilterSelect = function(_dateFilter)
    { 

        $scope.formattedAvailableDate = formatDate(_dateFilter);

        try {
            
            $scope.filterParameters.availabilityDate = new Date(_dateFilter); 
            //$scope.filterParameters.availabilityDate = ;

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters
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

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters 
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

    // $scope.onPropertyFilterSelect = function(_propertyType)
    // {
    //     console.log('onPropertyFilterSelect: ' + _propertyType);
    //     if (_propertyType === 'Entire' || _propertyType === 'Shared')
    //     {

    //         if (_propertyType === $scope.filterParameters.propertyType)
    //         {
    //             //Reset
    //             $scope.filterParameters.propertyType = 'ALL';
    //             $rootScope.propertyType = _propertyType;

    //             if (_propertyType === 'Entire')
    //                 $scope.img_entirePlace='/img/button_entirePlace.png';

    //             if (_propertyType === 'Shared')
    //                 $scope.img_sharedPlace='/img/button_sharedPlace.png';
            
    //         } else {
    //             $scope.filterParameters.propertyType = _propertyType
    //         }
    //         getPropertiesByTypeFilter();
    //     }
    //     else 
    //     {
    //         $location.path('/browse_apartmates');
    //         //getApartmates(_propertyType);
    //     }
    // };

    $scope.onPropertyFilterSelect = function(_propertyType) {

        console.log('onPropertyFilterSelect: ' + _propertyType);
        console.log($scope.filterParameters.propertyType);
        if (_propertyType === 'Entire' || _propertyType === 'Shared')
        {

            if (_propertyType === $scope.filterParameters.propertyType)
            {
                //Reset
                $scope.filterParameters.propertyType = 'ALL';
                $rootScope.propertyType = _propertyType;
            
            } else {
                $scope.filterParameters.propertyType = _propertyType
            }
            $scope.showListings = true;
            getPropertiesByTypeFilter();
        }
        else 
        {
            $scope.filterParameters.propertyType = _propertyType;
            $scope.showListings = false;
            $scope.checked = false;
            // $location.path('/browse_apartmates');
            //getApartmates(_propertyType);
        }
    }


    function getPropertiesByTypeFilter()
    {
        try {
            
            // console.log('Rooms: ' + _rooms);
            //$scope.filterParameters.propertyType = _propertyType;

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters
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
                filterParameters: $scope.filterParameters
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
                filterParameters: $scope.filterParameters
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

    var done = false;
    var doneOnce = false;

    // function getPropertyListingsByFilter()
    // {
    //     console.log("getPropertyListingsByFilter 1");
    //     console.log("Property Type: " + $scope.filterParameters.propertyType);
    //     try {

    //         PropertyListing.getPropertyListingsByFilter({
    //                 filterParameters: $scope.filterParameters
    //             },
    //         function(res) {
    //             renderProperties(res.properties);
    //             $scope.allNeighbourHoodProperties = res.properties;      
    //         },
    //         function(err) {
    //             $rootScope.error = err.message;
    //         });
    //     }
    //     catch(err) {
    //         $rootScope.error = err.message;
    //     }
    // };

    function getPropertyListingsByFilter()
    {
        console.log("getPropertyListingsByFilter");
        console.log("Property Type: " + $scope.filterParameters.propertyType);
        var aggregatedProperties = new Array();
        var combinedProperties = new Array();
        try {
            
            console.log($scope.filterParameters);

            PropertyListing.getPropertyListingsByFilter({
                filterParameters: $scope.filterParameters,
                email: $rootScope.user.emailAddress
            },
            function(res) {
                console.log(res.properties);
                renderProperties(res.properties);
                $scope.allNeighbourHoodProperties = res.properties;

            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };
    
   
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

    (function() {

    var d = window.Date,
        regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})(?:Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

    if (d.parse('2011-11-29T15:52:30.5') !== 1322581950500 ||
        d.parse('2011-11-29T15:52:30.52') !== 1322581950520 ||
        d.parse('2011-11-29T15:52:18.867') !== 1322581938867 ||
        d.parse('2011-11-29T15:52:18.867Z') !== 1322581938867 ||
        d.parse('2011-11-29T15:52:18.867-03:30') !== 1322594538867 ||
        d.parse('2011-11-29') !== 1322524800000 ||
        d.parse('2011-11') !== 1320105600000 ||
        d.parse('2011') !== 1293840000000) {

        d.__parse = d.parse;

        d.parse = function(v) {

            var m = regexIso8601.exec(v);

            if (m) {
                return Date.UTC(
                    m[1],
                    (m[2] || 1) - 1,
                    m[3] || 1,
                    m[4] - (m[8] ? m[8] + m[9] : 0) || 0,
                    m[5] - (m[8] ? m[8] + m[10] : 0) || 0,
                    m[6] || 0,
                    ((m[7] || 0) + '00').substr(0, 3)
                );
            }

            return d.__parse.apply(this, arguments);

        };
    }

    d.__fromString = d.fromString;

    d.fromString = function(v) {

        if (!d.__fromString || regexIso8601.test(v)) {
            return new d(d.parse(v));
        }

        return d.__fromString.apply(this, arguments);
    };

    })();

  
    // function renderProperties(_properties)
    // {
    //     console.log('renderProperties');
    //     // bedrooms: 'ALL',
    //     // price: 'ALL',
    //     // availabilityDate: 'ALL',
    //     // selectedGeometry: 'ALL',
    //     // propertyType: 'ALL'
        
    //     $scope.properties = new Array();

    //     var petsCondition = "No";
    //     // Pets

    //     if ($scope.filterParameters.pets.cats === true && $scope.filterParameters.pets.dogs === true)
    //     {
    //         petsCondition = 'Yes';   
    //         console.log('Both pets');

    //     } else if ($scope.filterParameters.pets.cats === true)
    //     {
    //         petsCondition = 'cats only';   
    //         console.log('Cats only');
    //     } else if ($scope.filterParameters.pets.dogs === true)
    //     {
    //         petsCondition = 'dogs only';   
    //         console.log('Dogs only');
    //     }

    //     for (var i = 0; i < _properties.length; i++)
    //     {
    //         var prop = _properties[i];
    //         var daysAgo = 0
    //         var myImageObject = new Object();
    //         var tagsObj = new Object();
    //         var locationGiven = false;
    //         var formattedAvailableDate = new Date();
    //         formattedAvailableDate = formattedAvailableDate.toDateString();
            
    //         // Craigslist
    //         if (prop['images'] && prop['images'] != '' && prop['images'] != '[]')
    //         {
    //             if (prop['location'] != '')
    //             {
    //                 locationGiven = true;
    //                 prop['lat'] = prop['location'].lat;
    //                 prop['lon'] = prop['location'].lon;
    //                 //console.log('lat: ' + prop['lat'] + ' / ' + 'lon: ' + prop['lon']);
    //             }



    //             if (prop['postDate'] && prop['postDate'] != '')
    //             {
                  
    //                 var formattedPostDate = prop['postDate'].toString().replace('["', '').replace('"]', '');
                    
    //                 formattedPostDate = formattedPostDate.replace(/-/g, "/");
    //                 formattedPostDate = formattedPostDate.replace(/T.*$/, "");
    //                 formattedPostDate = Date.parse(formattedPostDate);
    //                 prop['postDate'] = formattedPostDate;
    //                 daysAgo = Math.floor(( Date.now() - formattedPostDate) / 86400000);
              
    //             } 

    //             if (!prop['phone'])
    //                 prop['phone'] = '';

    //             if (!prop['email'])
    //                 prop['email'] = '';

    //             if (prop['availabilityDate'] && prop['availabilityDate'] != '')
    //             {
    //                 formattedAvailableDate = new Date(prop['availabilityDate']);
    //                 formattedAvailableDate = formattedAvailableDate.toDateString();
    //                 //console.log('formattedAvailableDate: ' + formattedAvailableDate);
    //             }

    //             if (!prop['description'])
    //             {
    //                 prop['description'] = '';
    //             } else if (prop['description'] && prop['description'] !== '')
    //             {
    //                 //console.log('origin: ' + originalDes);
    //                 //console.log('type: ' + typeof(prop['description']));
    //                 prop['description'] = prop['description'].toString();
    //                 prop['description'] = prop['description'].replace(/\\n/g , "").replace(/'/g, "").replace('[', "").replace(']', "").replace(/<br>/, "");
    //             }

    //             //console.log('des: ' + prop['description']);

    //             if (!prop['title'] || prop['title'] == '')
    //                 prop['title'] = prop['description'];

    //             myImageObject = eval('(' + prop['images'] + ')');
    //             tagsObj = eval('(' + prop['tags'] + ')');

    //             if (prop['title'].indexOf('proxy') != -1)
    //                 prop['title'] = 'N/A';

    //             if (prop['description'].indexOf('proxy') != -1)
    //                 prop['description'] = 'N/A';

    //             var allImages = new Array();

    //             for (var mo = 0; mo < myImageObject.length; mo++)
    //             {
    //                 var exists = false;
    //                 for (var m = 0; m < allImages.length; m++)
    //                 {
    //                     if (allImages[m] === myImageObject[mo])
    //                         exists = true;
    //                 }

    //                 if (exists === false)
    //                     allImages.push({ 'url': myImageObject[mo] });
    //             }
                
    //             var petsPassed = false ;
    //             var basementPassed = false;

    //             if (prop['petsWelcome'] && prop['petsWelcome'].length > 0 )
    //             {
    //                 if ((petsCondition === prop['petsWelcome'][0].name) || prop['petsWelcome'][0].name === 'Yes' )
    //                 {
                        
    //                     petsPassed = true;
    //                 } else if (petsCondition === 'No')
    //                 {
                        
    //                     petsPassed = true;
    //                 } else {
    //                     console.log('petsPassed is false');
    //                 }

    //                 if (petsCondition === "No")
    //                 {
    //                     petsPassed = true;
    //                 }

    //                 // BasementApartment
    //                 if (prop['basementApartment'] && prop['basementApartment'] === "Yes" && petsPassed === true)
    //                 {
                        
    //                     basementPassed = true; 
    //                 } else if ($scope.filterParameters.basementApartment !== 'Yes' && petsPassed === true)
    //                 {
                        
    //                     basementPassed = true; 
    //                 } else if ($scope.filterParameters.basementApartment !== 'Yes' && petsPassed === false) {
                        
    //                     basementPassed = true;
    //                 }

    //             } else {
    //                 prop['pets'] = "Not specified";
    //             } 

    //             if (petsCondition === 'No')
    //             {

    //                 petsPassed = true;
    //             } 

    //             if ($scope.filterParameters.basementApartment !== 'Yes')
    //             {
    //                 basementPassed = true;
    //             }

    //             if (prop['couplesWelcome'] && prop['couplesWelcome'].length > 0 )
    //                 prop['couples'] = prop['couplesWelcome'][0].name;
    //             else 
    //                 prop['couples'] = "N/A";

    //             if (!prop['basementApartment'])
    //                 prop['basementApartment'] = '';

    //             var addedAlready = false; 
    //             //console.log('_id: ' + prop['_id']);
    //             //console.log("prop['bedrooms']: " + prop['bedrooms']);
    //             if (prop['email'] !== '' && prop['title'] != '' && prop['description'] && prop['bedrooms'] != '' && locationGiven == true && basementPassed === true && petsPassed === true)
    //             {

    //                 // var filterPass = false;

    //                 // // Price 
    //                 // if ($scope.filterParameters.price != 'ALL')
    //                 // {
                        
    //                 //     var filter_minPrice = Number($scope.filterParameters.price.minPrice);
    //                 //     var filter_maxPrice = Number($scope.filterParameters.price.maxPrice);
    //                 //     console.log('Filter by this min Price: ' + filter_minPrice);
    //                 //     console.log('Filter by this max Price: ' + filter_maxPrice);
    //                 // } else {
    //                 //     var filter_minPrice = 1;
    //                 //     var filter_maxPrice = 5000;
    //                 // }

    //                 // if (prop['rentAmount'] >= $scope.filterParameters.filter_minPrice &&  prop['rentAmount'] <= $scope.filterParameters.filter_maxPrice )
    //                 //     filterPass = true;

    //                 for (var s = 0; s < $scope.properties.length; s++)
    //                 {
    //                     // console.log('id 1: ' + $scope.properties[s]._id);
    //                     // console.log('id 2: ' + prop['_id']);

    //                     if ($scope.properties[s]._id === prop['_id'] || $scope.properties[s].postId === prop['postId'])
    //                     {
                            
    //                         addedAlready = true;
    //                     }
    //                 }
    //                 //L.marker([lat, lon], {icon: listingIcon}).addTo(map).bindPopup(p);
    //                 if (addedAlready === false)
    //                 {
    //                     // console.log("myImageObject[0]: " + myImageObject[0]);
    //                     // console.log("daysAgo: " + daysAgo);
    //                     // console.log("prop['bathroom']: " + prop['bathrooms']);
    //                     //console.log("prop['bedroom']: " + prop['bedrooms']);
    //                     // console.log("prop['tags']: " + prop['tags']);
    //                     // console.log("prop['rentAmount']: " + prop['rentAmount']);
    //                     // console.log("prop['_id']: " + prop['_id']);

    //                     $scope.properties.push({'_id': prop['_id'], 'postId': prop['postId'], 'src': myImageObject[0], 'phone': prop['phone'], 'email': prop['email'], 'daysAgo': daysAgo, 'formattedAvailableDate': formattedAvailableDate, 'postDate': prop['postDate'], 'bathroom': prop['bathrooms'], 'bedroom': prop['bedrooms'], 'tags': prop['tags'], 'pets': prop['pets'], 'couples': prop['couples'], 'basementApartment': prop['basementApartment'], 'price': prop['rentAmount'], 'description': prop['description'], 'title': prop['title'], 'lon': prop['lon'], 'lat': prop['lat'], 'allImages': allImages });
    //                    // console.log('$scope.properties length: ' + $scope.properties.length);
    //                 } else {
    //                     //console.log('property already added');
    //                 }
    //             }          
    //         } else if (prop['addedImages'] && prop['addedImages'] != '' && prop['addedImages'].length > 0)
    //         {
    //             if (prop['location'] != '')
    //             {
    //                 locationGiven = true;
    //                 prop['lat'] = prop['location'].lat;
    //                 prop['lon'] = prop['location'].lon;
    //                 //console.log('lat: ' + prop['lat'] + ' / ' + 'lon: ' + prop['lon']);
    //             }

    //             if (prop['createdAt'] && prop['createdAt'] != '')
    //             {
    //                 daysAgo =  Math.floor(( Date.now() - Date.parse(prop['createdAt']) ) / 86400000);
    //             } 

    //             if (!prop['title'] || prop['title'] == '')
    //                 prop['title'] = prop['description'];

    //             var addedAlready = false; 


    //             var petsPassed = false ;
    //             var basementPassed = false;

    //             if (prop['petsWelcome'] && prop['petsWelcome'].length > 0 )
    //             {
    //                 if ((petsCondition === prop['petsWelcome'][0].name) || prop['petsWelcome'][0].name === 'Yes' )
    //                 {
    //                     console.log('Pets allowed');
    //                     petsPassed = true;
    //                 } else if (petsCondition === 'No')
    //                 {
    //                     console.log('petsCondition is No');
    //                     petsPassed = true;
    //                 } else {
    //                     console.log('petsPassed is false');
    //                 }

    //                 if (petsCondition === "No")
    //                 {
    //                     petsPassed = true;
    //                     console.log('petsPassed was set to true');
    //                 }

    //                 // BasementApartment
    //                 if (prop['basementApartment'] === "Yes" && petsPassed === true)
    //                 {
    //                     console.log('Pets passed and Basement Property is yes');
    //                     basementPassed = true; 
    //                 } else if ($scope.filterParameters.basementApartment !== 'Yes' && petsPassed === true)
    //                 {
    //                     console.log('basementCondition is no but Pets passed');
    //                     basementPassed = true; 
    //                 } else if ($scope.filterParameters.basementApartment !== 'Yes' && petsPassed === false) {
    //                     console.log('PetsPass failed and basementCondition is no');
    //                     basementPassed = true;
    //                 }
    //             } else {
    //                 prop['pets'] = "Not specified";
    //             } 
                
    //             if (petsCondition === 'No')
    //             {

    //                 petsPassed = true;
    //             } 

    //             if ($scope.filterParameters.basementApartment !== 'Yes')
    //             {
    //                 basementPassed = true;
                    
    //             }





    //             console.log('petsPassed: ' + petsPassed);
    //             console.log('basementPassed: ' + basementPassed);

    //             if (prop['title'] != '' && prop['bedrooms'] != '' && locationGiven == true && petsPassed === true && basementPassed === true)
    //             {

    //                 for (var s = 0; s < $scope.properties.length; s++)
    //                 {
    //                     if ($scope.properties[s]._id === prop['_id'])
    //                     {
    //                         addedAlready = true;
    //                     }
    //                 }
    //                 //L.marker([lat, lon], {icon: listingIcon}).addTo(map).bindPopup(p);
    //                 if (addedAlready === false)
    //                 {
    //                     // console.log("myImageObject[0]: " + myImageObject[0]);
    //                     // console.log("daysAgo: " + daysAgo);
    //                     // console.log("prop['bathroom']: " + prop['bathrooms']);
    //                     //console.log("prop['bedroom']: " + prop['bedrooms']);
    //                     // console.log("prop['tags']: " + prop['tags']);
    //                     // console.log("prop['rentAmount']: " + prop['rentAmount']);
    //                     // console.log("prop['_id']: " + prop['_id']);

    //                     $scope.properties.push({'_id': prop['_id'], 'allImages': prop['addedImages'], 'src': prop['addedImages'][0].url, 'phone': prop['phone'], 'email': prop['email'], 'daysAgo': daysAgo, 'formattedAvailableDate': formattedAvailableDate, 'postDate': prop['createdAt'], 'bathroom': prop['bathrooms'], 'bedroom': prop['bedrooms'], 'price': prop['rentAmount'], 'description': prop['description'], 'title': prop['title'], 'lon': prop['lon'], 'lat': prop['lat']});
    //                    // console.log('$scope.properties length: ' + $scope.properties.length);
    //                 } else {
    //                   //  console.log('property already added');
    //                 }
    //             }    
    //         }

             
    //     }

    // }

    function renderProperties(_properties)
    {
        console.log('renderProperties');
        console.log(_properties);
        // bedrooms: 'ALL',
        // price: 'ALL',
        // availabilityDate: 'ALL',
        // selectedGeometry: 'ALL',
        // propertyType: 'ALL'
        var currentDate = new Date();

        for(key in _properties){
          if( _properties[key].addedProfileImages.length > 0 ){
            var url = _properties[key].addedProfileImages[0].url.split('upload/');
            _properties[key].thumb = url[0] + 'upload/w_400,h_400,c_fill,g_face/' + url[1];
          }
          if( _properties[key].addedImages.length > 0 ){
            var url2 = _properties[key].addedImages[0].url.split('upload/');
            _properties[key].propertythumb = url2[0] + 'upload/w_500/' + url2[1];
          }
          console.log("XXXXXXXXXXXX");
          if(typeof _properties[key].fbBoostedExpired != "undefined"){
            _properties[key].fbExpired = true;
            if( currentDate > new Date(_properties[key].fbBoostedExpired) ){
              _properties[key].fbExpired = false;
            }
          }
        }

        $scope.originalPropertiesArray = _properties;
        $scope.properties = new Array();

        $scope.properties = _properties;
        $rootScope.propertiesGlobal = $scope.properties;

        // for (var i = 0; i < _properties.length; i++)
        // {
        //   if(_properties[i].published){
        //     drawMarker(_properties[i].location.lat, _properties[i].location.lon, _properties[i]._id);
        //     console.log(_properties[i].published);
        //     console.log(_properties[i]);
        //   }
        // }
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
                // console.log('addedProfileImages');
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

                        $scope.apartmates.push({'_id': prop['_id'], 'facebookVerified': facebookVerified, 'linkedInVerified': linkedInVerified, 'emailAddress': prop['emailAddress'], 'phoneNumber': prop['phoneNumber'], 'firstName': prop['firstName'], 'gender': capitalizeFirstLetter(prop['selectedGender']), 'ageGroup': prop['ageGroup'], 'src': prop['addedProfileImages'][0].url, 'daysAgo': daysAgo, 'postDate': prop['createdAt'], 'description': prop['personalDescription'], 'lifestyle': prop['lifestyle'], 'percent': prop['percent']});
                       // console.log('$scope.properties length: ' + $scope.properties.length);
                       $rootScope.apartmatesGlobal = $scope.apartmates;
                    } else {
                        console.log('apartmate already added');
                    }
                }    
            }
         
        }

    }

    getApartmates();


}]);