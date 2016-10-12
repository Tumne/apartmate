angular.module('angular-client-side-auth')
.controller('MobileNavCtrl', ['$rootScope', '$scope', '$location', 'Auth', '$modal', '$log', function($rootScope, $scope, $location, Auth, $modal, $log) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    $rootScope.user = Auth.user;
    $scope.myClass = "collapse";
     $scope.isCollapsed = true;

    if ($rootScope.user && $rootScope.user.firstName && $rootScope.user.firstName != '')
    {
      $rootScope.displayName = $rootScope.user.firstName;
      $scope.loggedIn = true;
    }
    else if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      $rootScope.displayName = $rootScope.user.emailAddress;
      $scope.loggedIn = true;
    }

    $scope.searchClicked = function() 
    {
      console.log('collapse yo: ' + $scope.isCollapsed);
      $location.path('/search');
      if ($scope.myClass == "collapse")
      {
        $scope.myClass = 'collapse';
        $scope.isCollapsed = false;
      } else {
        $scope.myClass = "collapse";
        $scope.isCollapsed = true;
      }
      //$scope.isCollapsed = true;
    }
    $rootScope.apartmateEmail = 'info@apartmate.ca';
    $rootScope.twitter = '//twitter.com/apartmatecanada';
    $rootScope.fb = '//www.facebook.com/ApartmateCanada';

    $scope.home = function()
    {
        $location.path('/');
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

        modalInstance.result.then(function (_filterParameters) {
          $scope.$emit('mobileFilterEventEmit', {filterParameters: _filterParameters});
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.logout = function() {
      $cookieStore.remove('user');
        $rootScope.user = null;
        angular.forEach($cookieStore, function (cookie, key) {
          console.log(key + ': ' + $cookieStore[key] + '\n');
        });
        console.log('DONE printing cookies AFTER deleting them');
        Auth.logout(function() {
            $location.path('/search');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.account = 'new';

    $scope.viewFavourites = function() 
    {
      if ($scope.loggedIn == true)
      {
        $location.path('/favorites');

      } else {
        $rootScope.nextTask = 'viewFavourites';
        $scope.openLogin("lg", "created");

      }
    }

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
          $scope.$emit('loginEventEmit', {user: _user});
          $scope.loggedIn = true
          if ($rootScope.nextTask === 'addProperty')
          {
            $location.path('/addProperty');
          } else if ($rootScope.nextTask === 'addSharedProperty')
          {
            $location.path('/shared_part1');
          }
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.openSignup = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'signupModal',
          controller: 'SignupModalCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
      };

    $scope.toggleDropdown = function($event) {
      console.log('bah ' + $scope.status.isopen);
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

     $scope.addEntirePlace = function()
    {
      console.log('$scope.loggedIn : ' + $scope.loggedIn );
      if ($scope.loggedIn == true)
      {
        // Call EntirePlace directly 

        $location.path('/addProperty');

      } else {
        // Login and then call EntirePlace. 
        $rootScope.nextTask = 'addProperty';
        $scope.openLogin("lg", "created");

      }
    };

    $scope.addSharedPlace = function()
    {
      if ($scope.loggedIn == true)
      {
        // Call EntirePlace directly 

        $location.path('/shared_part1');

      } else {
        // Login and then call EntirePlace. 
        $rootScope.nextTask = 'addSharedProperty';
        $scope.openLogin("lg", "created");

      }
    };

    
    $rootScope.indexLandlords = 0;
    $rootScope.indexRoommates = 0;
    $rootScope.indexRenters = 0;

    var location = $location.path();
    var slug = [];

    function getArticleIndex (articles, slug) {
      for(var key in articles)
        if(articles[key].slug == slug)
          return key;
    }

    if(location.indexOf("advice") > -1){
      slug = location.split('/advice/')[1].split('/');
      console.log(slug);
    }


    $http.get('http://www.apartmate.ca:5000/index.php/api/get_category_posts/?slug=advice-landlords')
    .success(function(data, status, headers, config){

        var articlesLandlords = data.posts;

        articlesLandlords.sort(function(a,b){
          return a.custom_fields.landlords_order - b.custom_fields.landlords_order;
        });

        if(slug[0] && slug[0] !== null && slug[0] == "landlords"){
          $rootScope.indexLandlords = getArticleIndex(articlesLandlords, slug[1]);
        }

        console.log("Articles Landlords:");
        console.log(articlesLandlords);
        $rootScope.articlesLandlords = articlesLandlords;
    })
    .error(function(data, status, headers, config){
        console.error("We have been unable to access the feed :-(");
    });


    $http.get('http://www.apartmate.ca:5000/index.php/api/get_category_posts/?slug=advice-renters')
    .success(function(data, status, headers, config){
        var articlesRenters = data.posts;

        articlesRenters.sort(function(a,b){
          return a.custom_fields.renters_order - b.custom_fields.renters_order;
        });

        if(slug[0] && slug[0] !== null && slug[0] == "renters"){
          $rootScope.indexRenters = getArticleIndex(articlesRenters, slug[1]);
        }

        console.log("Articles Renters:");
        console.log(articlesRenters);
        $rootScope.articlesRenters = articlesRenters;

    })
    .error(function(data, status, headers, config){
        console.error("We have been unable to access the feed :-(");
    });


    $http.get('http://www.apartmate.ca:5000/index.php/api/get_category_posts/?slug=advice-roommates')
    .success(function(data, status, headers, config){
        var articlesRoommates = data.posts;

        articlesRoommates.sort(function(a,b){
          return a.custom_fields.roommates_order - b.custom_fields.roommates_order;
        });

        if(slug[0] && slug[0] !== null && slug[0] == "roommates"){
          $rootScope.indexRoommates = getArticleIndex(articlesRoommates, slug[1]);
        }

        console.log("Articles Roommates:");
        console.log(articlesRoommates);
        $rootScope.articlesRoommates = articlesRoommates;

    })
    .error(function(data, status, headers, config){
        console.error("We have been unable to access the feed :-(");
    });

    $scope.resetRoommatesIndex = function(){
      $rootScope.indexRoommates = 0;
    };
    
    // $scope.pageslideChecked = false;

    // $scope.pageSlideToggle = function() {
    //   console.log("test");
    //   $scope.pageslideChecked = !$scope.pageslideChecked;
    // };
    
}]);


