angular.module('angular-client-side-auth')
.controller('MyProfileCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'Auth', 'PropertyListing', 'leafletData', '$modal', 'ApartmateProfile',  function($rootScope, $timeout, $scope, $location, $window, Auth, PropertyListing, leafletData, $modal, ApartmateProfile) {

    $rootScope.seo = {
      title: "Apartmate | My Profile",
      description: "My Profile"
    };

    $scope.onEditProfileSelect = function()
    {
        $location.path('/edit_roommate/');
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.getApartmateDetail = function()
    {
        try {
            console.log('getApartmateDetail user emailAddress: ' + Auth.user.emailAddress);
            ApartmateProfile.getApartmateListing({
                emailAddress: Auth.user.emailAddress
            },
            function(res) {
                console.log('id: ' + res.apartmate.firstName);
                console.log(res.apartmate);

                $scope.myApartmate = res.apartmate;
                
                if($scope.myApartmate.addedProfileImages.length > 0){
                    $scope.myApartmate.src = $scope.myApartmate.addedProfileImages[0].url;
                } else {
                    $scope.myApartmate.src = '/img/profile/profile_242x200.png';
                }

                // $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                console.log($scope.myApartmate.selectedGender);
                console.log($scope.myApartmate.ageGroup);

                // TODO
                console.log($scope.myApartmate.propertyListing.length);

                for(i=0; i < $scope.myApartmate.propertyListing.length; i++ ){
                    console.log(i);
                    var formattedPostDate = $scope.myApartmate.propertyListing[i].publishedAt.toString();
                    formattedPostDate = formattedPostDate.replace(/-/g, "/");
                    formattedPostDate = formattedPostDate.replace(/T.*$/, "");
                    formattedPostDate = Date.parse(formattedPostDate);
                    $scope.myApartmate.propertyListing[i].daysAgo = Math.floor(( Date.now() - formattedPostDate) / 86400000);
                }


                if(typeof $scope.myApartmate.selectedGender != "undefined")
                    $scope.myApartmate.gender = capitalizeFirstLetter($scope.myApartmate.selectedGender);
                
                // $scope.apartmate.selectedLifestyle = $scope.apartmate.lifestyle;
                // $scope.apartmate.phone = $scope.apartmate.phoneNumber;
                // $scope.apartmate.selectedAgeGroup = $scope.apartmate.ageGroup;
                $scope.myApartmate.facebookVerified = false;
                $scope.myApartmate.linkedInVerified = false;


                // for (var i = 0; i < $scope.apartmate.addedProfileImages.length; i++)
                // {
                //   var url = $scope.apartmate.addedProfileImages[i].url;
                //   $scope.existingImages.push(url);
                // }

                if ($scope.myApartmate.provider.length > 0)
                {
                    console.log('line 8718');
                    for (var p = 0; p < $scope.myApartmate.provider.length; p++)
                    {
                      
                        if ($scope.myApartmate.provider[p].name === 'facebook')
                            $scope.myApartmate.facebookVerified = true;

                        if ($scope.myApartmate.provider[p].name === 'linkedin')
                           $scope.myApartmate.linkedInVerified = true;
                    }
                
                } else {
                  console.log('provider is 0')
                }
                $rootScope.success = 'Found it, we sent you an email with instructions on how to reset your password';
            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
    };

    $scope.toggleActivateProfileSelect = function(){
        console.log($scope.myApartmate._id);

        ApartmateProfile.updateActiveProfile({
            email: $scope.myApartmate.emailAddress
        },
        function(res) {
            // console.log('id: ' + res.apartmate.firstName);
            console.log(res.apartmate);
            
            $scope.myApartmate = res.apartmate;
            // $scope.apartmate.activeProfile = res.apartmate.activeProfile;

        },
        function(err) {
            $rootScope.error = err.message;
        });
    };
   
    $scope.socialClick = function(_social)
    {
        var link = ''
        if (_social == 'twitter')
            link = '//twitter.com/apartmatecanada';

        if (_social == 'fb')
            link = '//www.facebook.com/ApartmateCanada';

        $window.open(link);
    }
    if ($rootScope.user && $rootScope.user.emailAddress && $rootScope.user.emailAddress !== ''){
        console.log($rootScope.user);
        $scope.myApartmate = $rootScope.user;
        $scope.myApartmate.gender = $scope.myApartmate.selectedGender;
        $scope.myApartmate.firstName = $scope.myApartmate.username;
        
        $scope.getApartmateDetail();
    } else {
        $rootScope.nextTask = "myProfile";
        $location.path($location.url("/"));
    }

    $scope.goToMyListing = function(_propertyId){
        console.log(_propertyId);
        $location.path('/property_listing/' + _propertyId);
    };

}]);


