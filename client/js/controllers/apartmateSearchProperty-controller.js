angular.module('angular-client-side-auth')
.controller('ApartmateSearchPropertyCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'ApartmateProfile', function($rootScope, $timeout, $scope, $location, $window, ApartmateProfile) {

    
    // default the user's values to the available range
    $scope.userMinPrice = $scope.minPrice;
    $scope.userMaxPrice = $scope.maxPrice;

    $scope.img_entirePlace = '/img/button_entirePlace.png';
    $scope.img_sharedPlace ='/img/button_sharedPlace.png';
    $scope.img_apartmate ='/img/button_apartmate_on.png';


    $scope.properties = new Array();
    $scope.selectedGender = 'ALL';
    //$scope.markers = new Array();
    $scope.formattedAvailableDate = formatDate(new Date());
    //$scope.date = new Date();
    $scope.selectedNeighbourhoods = new Array();
    $scope.allNeighbourHoodProperties = new Array();
    $scope.selectedNeighbourhoodProperties = new Array();
    $scope.selectedNeighbourhoodsCount = 0;

    $scope.priceRange = {
        minPrice: 100,
        maxPrice: 3000
      };

    $scope.filterParameters = {
        price: 'ALL',
        age: 'ALL',
        gender: 'ALL',
        leaseTerm: 'ALL',
        availabilityDate: 'ALL'    
    }

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

    $scope.onDateFilterSelect = function(_dateFilter)
    { 

        $scope.formattedAvailableDate = formatDate(_dateFilter);

        try {
            
            $scope.filterParameters.availabilityDate = new Date(_dateFilter); 

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters
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
                filterParameters: $scope.filterParameters 
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
                filterParameters: $scope.filterParameters 
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


    $scope.onPriceFilterSelect = function()
    {
        try {
            $scope.filterParameters.price = $scope.priceRange;

            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters 
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
                filterParameters: $scope.filterParameters
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
        $rootScope.filterParameters = $scope.filterParameters;
        $location.path('/roommate?id='+_roommate._id);
        //console.log('$location.path: ' + $location.path);
    }

    $scope.onPropertyFilterSelect = function(_propertyType)
    {
        if (_propertyType === 'Entire' || _propertyType === 'Shared')
        {
            
            $scope.filterParameters.propertyType = _propertyType;
            $rootScope.propertyType = _propertyType;
            $location.path('/search');
            //getPropertiesByTypeFilter(_propertyType);
        }
        else {
            $scope.filterParameters.propertyType = _propertyType;
            getApartmates();
        }
    }

    function getApartmates()
    {
        try {
            
            console.log('getApartmates');
            //$scope.filterParameters.propertyType = 'Apartmate';

            console.log('$scope.filterParameters gender: ' + $scope.filterParameters.gender);
            ApartmateProfile.getApartmateListingsByFilter({
                filterParameters: $scope.filterParameters
            },
            function(res) {

                renderApartmates(res.apartmates);
                
                console.log(res.apartmates);
                console.log('got me: ' + res.apartmates.length);
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
        // bedrooms: 'ALL',
        // price: 'ALL',
        // availabilityDate: 'ALL',
        // selectedGeometry: 'ALL',
        // propertyType: 'ALL'
        
        $scope.apartmates = new Array();
        
        for (var i = 0; i < _apartmates.length; i++)
        {
            var prop = _apartmates[i];
            var daysAgo = 0

            if (prop['addedProfileImages'] && prop['addedProfileImages'] != '' && prop['addedProfileImages'].length > 0)
            {
                console.log('addedProfileImages');
                if (prop['updatedAt'] && prop['updatedAt'] != '')
                {
                    daysAgo =  Math.floor(( Date.now() - Date.parse(prop['updatedAt']) ) / 86400000);
                } 

                if (!prop['displayName'] || prop['displayName'] == '')
                    prop['displayName'] = prop['personalDescription'];

                var addedAlready = false; 
                //console.log('_id: ' + prop['_id']);
                //console.log("prop['bedrooms']: " + prop['bedrooms']);
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
                         console.log("prop['addedProfileImages'][0].url " +prop['addedProfileImages'][0].url);
                         console.log("prop['_id']: " + prop['_id']);
                         console.log("prop['selectedGender']: " + prop['selectedGender']);
                         console.log("prop['firstName']: " + prop['firstName']);
                         console.log("prop['ageGroup']: " + prop['ageGroup']);
                         console.log('daysAgo: ' + daysAgo);
                         console.log('createdAt: ' + prop['createdAt']);
                         console.log("prop['personalDescription']: " + prop['personalDescription']);
                        console.log("prop['_id']: " + prop['_id']);
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

                        $scope.apartmates.push({'_id': prop['_id'], 'facebookVerified': facebookVerified, 'linkedInVerified': linkedInVerified, 'emailAddress': prop['emailAddress'], 'phoneNumber': prop['phoneNumber'], 'firstName': prop['firstName'], 'gender': capitalizeFirstLetter(prop['selectedGender']), 'ageGroup': prop['ageGroup'], 'src': prop['addedProfileImages'][0].url, 'daysAgo': daysAgo, 'postDate': prop['createdAt'], 'description': prop['personalDescription'], 'lifestyle': prop['lifestyle']});
                       // console.log('$scope.properties length: ' + $scope.properties.length);
                    } else {
                        console.log('apartmate already added');
                    }
                }    
            }

             
        }
        $rootScope.success = "We've got " + $scope.apartmates.length + " listings.";
        console.log('Filtered: ' + $scope.apartmates.length);
        // for (var i = 0; i < $scope.properties.length; i++)
        // {
        //     drawMarker($scope.properties[i].lat, $scope.properties[i].lon, $scope.properties[i]._id);
        // }
    }
    
}]);


