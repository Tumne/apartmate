angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', '$modal', '$state', '$stateParams', 'baseUrl', '$http', 'PropertyListing', function($rootScope, $scope, $location, $window, Auth, $modal, $state, $stateParams, baseUrl, $http, PropertyListing) {

    $scope.showBackButton = false;
    $rootScope.fbURL = baseUrl + $location.path();
    $rootScope.fbIMG = baseUrl + '/img/apartmate-logo-fb.png';
    $rootScope.fbTitle = "Apartmate";
    $rootScope.fbDesc = "Find rental apartments and roommates you love coming home to";

    $http.get('http://www.apartmate.ca:5000/index.php/api/get_page/?slug=event')
    .success(function(data, status, headers, config){

        var eventMixer = data.page.custom_fields;
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        var dateString  = eventMixer.date[0];
        // var dateString  = "20151127";

        var year        = dateString.substring(0,4);
        var month       = dateString.substring(4,6);
        var day         = dateString.substring(6,8);
        var date        = new Date(year, month-1, day).setHours(0,0,0,0);
        var currentDate = new Date().setHours(0,0,0,0);


        $rootScope.event = {};
        $rootScope.event.dateFuture = (date >= currentDate)? true: false;
        $rootScope.event.date = monthNames[dateString.substring(4,6) - 1] + " " + day + ", " + year;
        $rootScope.event.time = eventMixer.event_time[0];
        $rootScope.event.link = eventMixer.link[0];
        $rootScope.event.address = eventMixer.address[0];

    })
    .error(function(data, status, headers, config){
        window.alert("We have been unable to access the feed :-(");
    });



    // HACK
    // TO DO: Cache properties using redis caching

    function renderProperties(_properties)
    {
        console.log('renderProperties');
        var currentDate = new Date();
        for(var key in _properties){
          if( _properties[key].addedProfileImages.length > 0 ){
            var url = _properties[key].addedProfileImages[0].url.split('upload/');
            _properties[key].thumb = url[0] + 'upload/w_400,h_400,c_fill,g_face/' + url[1];
          }
          if( _properties[key].addedImages.length > 0 ){
            var url2 = _properties[key].addedImages[0].url.split('upload/');
            _properties[key].propertythumb = url2[0] + 'upload/w_500/' + url2[1];
          }
          if(typeof _properties[key].fbBoostedExpired != "undefined"){
            _properties[key].fbExpired = true;
            if( currentDate > new Date(_properties[key].fbBoostedExpired) ){
              _properties[key].fbExpired = false;
            }
          }
        }

        $rootScope.propertiesGlobal = _properties;

    }

    function getPropertiesByTypeFilter()
    {
        $scope.filterParameters = {
            bedrooms: 'ALL',
            age: 'ALL',
            gender: 'ALL',
            leaseTerm: 'ALL',
            availabilityDate: 'ALL',
            selectedGeometry: new Array(),
            propertyType: 'ALL',
            basementApartment: 'Yes',
            bathrooms: 'ALL',
            pets: { 'cats': false, 'dogs': false},
            userMinPrice: $scope.minPrice,
            userMaxPrice: $scope.maxPrice,
            price: {
                minPrice: 400,
                maxPrice: 3000
            }
        };
        console.log($scope.filterParameters);

        PropertyListing.getPropertyListingsByFilter({
            filterParameters: $scope.filterParameters,
            email: $rootScope.user.emailAddress
        },
        function(res) {
            console.log(res.properties);
            renderProperties(res.properties);
            
        },
        function(err) {
            $rootScope.error = err.message;
        });
    }


    $scope.$on('showBackButtonBroadcast', function(event, args) {
      $scope.showBackButton = true;
    });

    if($stateParams.email && $stateParams.token){
      Auth.verify({
          emailAddress: $stateParams.email,
          token: $stateParams.token
      },
      function(res) {
          console.log('message: ' + res);
          console.log(res);
          $rootScope.user = res.user;
          $scope.$emit('loginEventEmit', {user: $rootScope.user});

          var modalInstance = $modal.open({
            templateUrl: 'initialModal',
            controller: 'InitialModalCtrl',
            size: 'lg',
            resolve: {
              status: function () {
                return false;
              }
            }
          });

          $location.search('');
          $location.path('/search');
      },
      function(err) {
          //$rootScope.error = err.message;
          console.log('err: ', err.message);
          $scope.alerts = new Array();
          $scope.alerts.push({type: 'danger', msg: err.message});
      });

    }

    var redirect = $location.search()['redirect'];
    if(redirect == "myProfile"){
      $rootScope.nextTask = redirect;
    }
    $scope.advicePanel = 'article1';


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
          console.log('user id: ' + $rootScope.user._id);
          $scope.$emit('loginEventEmit', {user: _user});
          $scope.loggedIn = true;
          if ($rootScope.nextTask === 'viewPropertyListing')
          {
            $location.path('/property_listing/' + $rootScope.targetID);
            $rootScope.nextTask = null;
            $rootScope.targetID = null;
          } else if($rootScope.nextTask == "myProfile"){
            $location.path($location.url("/my_profile/"));
            $rootScope.nextTask = null;
          }
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    if($rootScope.nextTask == "viewPropertyListing" ){
      $scope.openLogin("lg", "created");
      console.log($rootScope.nextTask);
    } else if ($rootScope.nextTask == "myProfile"){
      if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress !== ''){
        $location.path($location.url("/my_profile/"));
      } else {
        $scope.openLogin("lg", "created");
        console.log($rootScope.nextTask);
      }      
    }



    $scope.switchArticle = function(value){
        console.log(value);
        $scope.advicePanel = value;
        console.log($scope.advicePanel);
    }

    $scope.backToTop = function(){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    $scope.startSearch = function()
    {
        $location.path('/search');
    }

    $scope.tickets = function()
    {
        $window.open('http://www.eventbrite.ca/e/toronto-roommate-mixer-tickets-17974050870');
        //$location.path("");
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
                 + "?subject=New%20email " + escape('From Home Page');

        window.location.href = link;

    };

    $scope.postPropertyToFB = function() {
      FB.ui({
        method: 'feed',
        link: baseUrl + '/property/55e76c315d0c230300a70560',
        picture: 'http://res.cloudinary.com/apartmate/image/upload/v1443842068/le8a8hltrbqg7ue9bylm.jpg',
        caption: 'Female only',
        description: 'The space is a 2 bedroom condominium apartment on one of the top floors. the building amenities include swimming pool, jacuzzi, steam bath, gymnesium, concierge, beautiful barbecue terrace. the building is well connected. I have day job and laid back during other times. however, I would like to rent the room to someone who is appreciative and considerate of another persons property. Contact me at shabnam.azad@hotmail.com or text at'
      }, function(response){

        console.log(response);
      });
    };

    if(!$rootScope.initHackProperties){
      getPropertiesByTypeFilter();
      console.log($rootScope.initHackProperties);
      $rootScope.initHackProperties = true;
    }
}]);

