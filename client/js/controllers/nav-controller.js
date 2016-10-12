
angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'QuestionsListing', '$stateParams', 'PropertyListing', '$http', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, QuestionsListing, $stateParams, PropertyListing, $http) {
    
    $rootScope.seo = {
      title: "Apartmate | Home",
      description: "Find rental apartments and roommates you love coming home to"
    };

    if ($cookieStore.get('user') != undefined)
      console.log('cookieStoredUser firstName: ' + $cookieStore.get('user').firstName);

    if(typeof $rootScope.user != "undefined"){
      console.log("typeof $rootScope.user != undefined");

      if($rootScope.user.firstName == $rootScope.user.emailAddress){
        console.log("$rootScope.user.firstName == $rootScope.user.emailAddress");
        $scope.user = Auth.user;
        $rootScope.user = Auth.user;
        $scope.user.emailAddress = $rootScope.user.emailAddress;
      } else {
        console.log("$rootScope.user.firstName != $rootScope.user.emailAddress");
        $scope.user = $rootScope.user;
      }
    } else {
      console.log("rootScope.user: UNDEFINED");
      $scope.user = Auth.user;
      $rootScope.user = Auth.user;
      $scope.user.emailAddress = $rootScope.user.emailAddress;
    }

    

    $scope.navbarCollapsed = false;
    $scope.isCollapsed = true;
    $scope.apartmateListingCreated = false;

    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    //facebookLoginCheck();

    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      $rootScope.displayName = $rootScope.user.firstName;
      $scope.loggedIn = true;

      console.log('$rootScope.user.firstName: ' + $rootScope.user.firstName);
      console.log('user id: ' + $rootScope.user.id);
      console.log('user _id: ' + $rootScope.user._id);
      console.log('apartmateListingCreated: ' + $rootScope.user.apartmateListingCreated);
    }
    else if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress != '')
    {
      $rootScope.displayName = $rootScope.user.emailAddress;
      $scope.loggedIn = true;
      $rootScope.user.apartmateListingCreated = $rootScope.user.apartmateListingCreated;
      console.log('Line 35 apartmateListingCreated: ' + $rootScope.user.apartmateListingCreated);
    } else {
       $scope.user.apartmateListingCreated = false;
    }



  $scope.$on('loginEventBroadcast', function(event, args)
    {
      console.log('Line 43 Logged in: ' + args.user.emailAddress);
      //var us = $cookieStore.get('user');
      //console.log('us user: ' + us.emailAddress);
      console.log(args.user);
      // $scope.user.firstName = args.user.emailAddress;
      
      console.log("TEST");

      Auth.user = args.user;
      $scope.user = args.user;
      $scope.userRoles = Auth.userRoles;
      $scope.accessLevels = Auth.accessLevels;
      $rootScope.user = Auth.user;
      $scope.user = $rootScope.user;
      console.log($rootScope.user);
      //TO DO: Figure out picture profile on re-render bug
      
      if($scope.user.addedProfileImages.length > 0){
          $scope.user.src = $scope.user.addedProfileImages[0].url;
      } else {
          $scope.user.src = '/img/profile/placeholder.png';
      }
      
      console.log('$rootScope.user.emailAddress: ' + $rootScope.user.emailAddress);
      console.log('Line 54 apartmateListingCreated: ' + $scope.user.apartmateListingCreated);
      if ($rootScope.user.apartmateListingCreated === true)
        $scope.apartmateListingCreated = true;

      if($rootScope.user.profileCreated === true)


      //getPropertyListingsByFilter();
      $scope.loggedIn = true;
    });



    $scope.$on('FBLoginEventBroadcast', function(event, args)
    {
      console.log('Logged in: ' + args.user.emailAddress);
      //var us = $cookieStore.get('user');
      //console.log('us user: ' + us.emailAddress);
      $scope.user.firstName = args.user.emailAddress;
      Auth.user = args.user;
      $scope.user = args.user;
      $scope.userRoles = Auth.userRoles;
      $scope.accessLevels = Auth.accessLevels;
      $rootScope.user = Auth.user;
      $scope.user = $rootScope.user;
      console.log('$rootScope.user.apartmateListingCreated === true: ' + $rootScope.user.apartmateListingCreated === true);
      if ($rootScope.user.apartmateListingCreated === true)
        $scope.apartmateListingCreated = true;
      console.log('$rootScope.user.emailAddress: ' + $rootScope.user.emailAddress);
      console.log('apartmateListingCreated: ' + $rootScope.user.apartmateListingCreated);
      //getPropertyListingsByFilter();
      $scope.loggedIn = true;
    });

    $scope.$on('RoommateProfileCreatedBroadcast', function(event, args) 
    { 
      $scope.apartmateListingCreated = ($scope.user.apartmateListingCreated)?true:false;
      $scope.user.profileCreated = true;
      $scope.user = $rootScope.user;
      console.log($scope.user);
      $scope.user.src = ($scope.user.addedProfileImages.length > 0) ? $scope.user.addedProfileImages[0].url : '/img/profile/placeholder.png';
      $scope.user.username = $scope.user.firstName;
      $rootScope.user = $scope.user;
      console.log("here!!!!!!!");
      console.log('apartmateListingCreated: ' + $rootScope.user.apartmateListingCreated);
      console.log($rootScope.user);
      $rootScope.broadcasted = true;
    });



    $scope.openQuestions = function () {

      QuestionsListing.getQuestions({},
      function(res) {
          console.log(res.questionsListing);

          var modalInstance = $modal.open({
          templateUrl: 'questionsModal',
          controller: 'QuestionsModalCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            questions: function () {
              return res.questionsListing;
            }
          }
        });

        modalInstance.result.then(function () {
            console.log("closed questionsModal");
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

      },
      function(err) {
        $rootScope.error = err.message;
      });
  
    };

    $scope.$on('MatchmakingQuestionsBroadcast', function(event, args) { 

      if(!$rootScope.user.questionsAnswered) $scope.openQuestions();

    });

    // For testing
    // $scope.$emit('MatchmakingQuestionsEmit', {});

    $scope.searchClicked = function() 
    {

      console.log('collapse: ' + $scope.isCollapsed);
    }

    $rootScope.apartmateEmail = 'info@apartmate.ca';
    $rootScope.twitter = '//twitter.com/apartmatecanada';
    $rootScope.fb = '//www.facebook.com/ApartmateCanada';
    var userRoles = routingConfig.userRoles;

    function setCookie(name, value, expires){
    document.cookie = name + "=" + escape(value) + "; ";

    if(expires){
        expires = setExpiration(expires);
        document.cookie += "expires=" + expires + "; ";

    }
}
//expiration of your cookie
function setExpiration(cookieLife){
    var today = new Date();
    var expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return  expr.toGMTString();
}

//get cookie with namecookie...
function getCookie(w){
   cName = "";
   pCOOKIES = new Array();
   pCOOKIES = document.cookie.split('; ');

       for(bb = 0; bb < pCOOKIES.length; bb++){
          NmeVal  = new Array();
          NmeVal  = pCOOKIES[bb].split('=');
          if(NmeVal[0] == w){
             cName = unescape(NmeVal[1]);
          }
       }
  return cName;
}

    $scope.logout = function() {

        $rootScope.nextTask = null;
        //$rootScope.user = null;
        angular.forEach($cookieStore, function (cookie, key) {
          console.log(key + ': ' + $cookieStore[key] + '\n');
        });
        //setCookie('user','')
        
        //$cookieStore.remove('user');

      //   angular.forEach($cookieStore, function(value, key) {
      //     $cookieStore.remove(key);
      // });
      //   angular.forEach($cookieStore, function (cookie, key) {
      //     $cookieStore[key] = null;

      //     console.log(key + ': ' + $cookieStore[key] + '\n');
      //   });
        console.log('DONE printing cookies AFTER deleting them');
        Auth.logout(function() {
          angular.forEach($cookieStore, function (cookie, key) {
          console.log(key + ': ' + $cookieStore[key] + '\n');
        });
            //$cookieStore.remove('user');
            //$rootScope.user = null;
            //$scope.user = null;
            //Auth.user = null;

            if (Auth.user)
            {
              Auth.user.emailAddress = '';
              Auth.user.username =  '';
              Auth.user.role =  userRoles.public;
              //Auth.user = null;
            }

            if ($scope.user)
            {
              $scope.user.emailAddress = '';
              $scope.user.username =  '';
              $scope.user.role =  userRoles.public;
              //$scope.user = null;
            }


            if ($rootScope.user)
            {
              $rootScope.user.emailAddress =  '';
              $rootScope.user.username =  '';
              $rootScope.user.role =  userRoles.public;
              //$rootScope.user = null;
            }

            $scope.loggedIn = false;
            $rootScope.loggedIn = false;
            $scope.apartmateListingCreated = false;
            // $location.path($location.url("/"));
            
            $location.path('/');
            //$window.location.reload();
            console.log('removed');
        }, function() {
          console.log('could not remove');
            $rootScope.error = "Failed to logout";
        });
    };

    $scope.items = ['item1', 'item2', 'item3'];
    $scope.account = 'new';

    $scope.myRoommateProfile = function()
    {
      if ($scope.loggedIn == true)
      {
        $location.path('/my_profile');
        // $location.path('/edit_roommate/');

      } else {
        $rootScope.nextTask = 'editRoommateProfile';
        $scope.openLogin("lg", "created");

      }
    }

    $scope.viewFavourites = function() 

    {
      console.log($scope.loggedIn);
      
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
          console.log(_user);
          if($rootScope.user.verifiedUser){
            $rootScope.user = _user;
            console.log('email: ' + $rootScope.user.emailAddress);
            console.log('user id: ' + $rootScope.user._id);
            $scope.$emit('loginEventEmit', {user: _user});

            $scope.loggedIn = true;
            if ($rootScope.nextTask === 'addProperty')
            {
              $location.path('/addProperty');
            } else if ($rootScope.nextTask === 'addSharedProperty')
            {
              $location.path('/shared_part1');
            } else {
              $location.path('/search');
              $state.transitionTo($state.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
            }
          } else {
            $location.path('/search');
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
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
          console.log($scope.selected);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
      };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    

    $scope.addRoommateProfile = function()
    {
      console.log('$scope.loggedIn : ' + $scope.loggedIn );
      console.log('$scope.apartmateListingCreated : ' + $scope.user.apartmateListingCreated );
      
      if ($scope.loggedIn == true && ($rootScope.user.emailAddress && $rootScope.user.emailAddress != ''))
      {
        // Call Rooommate Profile directly 

        $location.path('/roommateProfile_part1');
        console.log("here");
      } else {
        // Login and then call EntirePlace. 
        $rootScope.nextTask = 'addRoommateProfile';
        $scope.openLogin("lg", "new");
      }
    };

    $scope.addEntirePlace = function()
    {
      console.log('$scope.loggedIn : ' + $scope.loggedIn );
      console.log('$rootScope.user.emailAddress: ' + $rootScope.user.emailAddress)
      
      if ($scope.loggedIn == true && ($rootScope.user.emailAddress && $rootScope.user.emailAddress != ''))
      {
        // Call EntirePlace directly 

        $location.path('/addProperty');

      } else {
        // Login and then call EntirePlace. 
        $rootScope.nextTask = 'addProperty';
        $scope.openLogin("lg", "new");
      }
    };

    $scope.addSharedPlace = function()
    {
      if ($scope.loggedIn == true && ($rootScope.user.emailAddress && $rootScope.user.emailAddress != ''))
      {
        // Call EntirePlace directly 
        $location.path('/shared_part1');

      } else {
        // Login and then call EntirePlace. 
        $rootScope.nextTask = 'addSharedProperty';
        $scope.openLogin("lg", "new");
      }
    };

    $scope.click = function(){
      $('.navbar-toggle').click();
    };

    $scope.openFilter = function (size) {
        
        $location.path('/search');

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

    $scope.createQuestion = function() {

      var modalInstance = $modal.open({
          templateUrl: 'createdQuestionsModal',
          controller: 'CreatedQuestionsModalCtrl',
          size: 'md',
          resolve: {
            status: function () {
              return $rootScope.user;
            }
          }
        });

        modalInstance.result.then(function (_filterParameters) {

        }, function () {

        });
    };

    // $scope.createQuestion();


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

        console.log("Articles Landlords:");
        console.log(articlesLandlords);
        $rootScope.articlesLandlords = articlesLandlords;

        if(slug[0] && slug[0] !== null && slug[0] == "landlords"){
          $rootScope.indexLandlords = getArticleIndex($rootScope.articlesLandlords, slug[1]);
          $rootScope.fbTitle = $rootScope.articlesLandlords[$rootScope.indexLandlords].title;
          $rootScope.fbDesc = $rootScope.articlesLandlords[$rootScope.indexLandlords].custom_fields.excerpt[0];
          $rootScope.fbIMG = $rootScope.articlesLandlords[$rootScope.indexLandlords].thumbnail;
        }

        
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

        console.log("Articles Renters:");
        console.log(articlesRenters);
        $rootScope.articlesRenters = articlesRenters;

        if(slug[0] && slug[0] !== null && slug[0] == "renters"){
          $rootScope.indexRenters = getArticleIndex($rootScope.articlesRenters, slug[1]);
          $rootScope.fbTitle = $rootScope.articlesRenters[$rootScope.indexRenters].title;
          $rootScope.fbDesc = $rootScope.articlesRenters[$rootScope.indexRenters].custom_fields.excerpt[0];
          $rootScope.fbIMG = $rootScope.articlesRenters[$rootScope.indexRenters].thumbnail;
        }



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

        console.log("Articles Roommates:");
        console.log(articlesRoommates);
        $rootScope.articlesRoommates = articlesRoommates;

        if(slug[0] && slug[0] !== null && slug[0] == "roommates"){
          $rootScope.indexRoommates = getArticleIndex($rootScope.articlesRoommates, slug[1]);
          $rootScope.fbTitle = $rootScope.articlesRoommates[$rootScope.indexRoommates].title;
          $rootScope.fbDesc = $rootScope.articlesRoommates[$rootScope.indexRoommates].custom_fields.excerpt[0];
          $rootScope.fbIMG = $rootScope.articlesRoommates[$rootScope.indexRoommates].thumbnail;
        }

    })
    .error(function(data, status, headers, config){
        console.error("We have been unable to access the feed :-(");
    });

    $scope.resetRoommatesIndex = function(){
      $rootScope.indexRoommates = 0;
      $rootScope.fbTitle = $rootScope.articlesRoommates[$rootScope.indexRoommates].title;
      $rootScope.fbDesc = $rootScope.articlesRoommates[$rootScope.indexRoommates].custom_fields.excerpt[0];
      $rootScope.fbIMG = $rootScope.articlesRoommates[$rootScope.indexRoommates].thumbnail;
    };

    $scope.slidemenuChecked = false; // This will be binded using the ps-open attribute

    $scope.slidemenuToggle = function() {
        $scope.slidemenuChecked = !$scope.slidemenuChecked;
    };

    $scope.openLoginMobile = function() {
      $scope.slidemenuToggle();
      $scope.openLogin("lg", "created");
    };

    $scope.openSignupMobile = function() {
      $scope.slidemenuToggle();
      $scope.openLogin("lg", "new");   
    }

    $scope.resetRoommatesIndexMobile = function() {
      $scope.slidemenuToggle();
      $scope.resetRoommatesIndex();
    };

    $scope.addSharedPlaceMobile = function() {
      $scope.slidemenuToggle();
      $scope.addSharedPlace();
    };

    $scope.addEntirePlaceMobile = function() {
      $scope.slidemenuToggle();
      $scope.addEntirePlace();
    };

    $scope.addRoommateProfileMobile = function() {
      $scope.slidemenuToggle();
      $scope.addRoommateProfile();
    };

    $scope.logoutMobile = function() {
      $scope.slidemenuToggle();
      $scope.logout();
    };

}]);


