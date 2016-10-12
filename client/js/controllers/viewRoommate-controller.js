angular.module('angular-client-side-auth')
.controller('ViewRoommateCtrl',
['$rootScope', '$timeout', '$scope', '$location', '$window', 'leafletData', 'ApartmateProfile', '$stateParams', 'baseUrl', 'QuestionsListing', '$state', function($rootScope, $timeout, $scope, $location, $window, leafletData, ApartmateProfile, $stateParams, baseUrl, QuestionsListing, $state ) {

    $scope.apartmate = new Object();
    $scope.showQuestions = false;

    targetID = $stateParams.id;
    // var targetID = $location.search()['id'];
    // targetID = targetID.substring(0, targetID.length - 2);
    console.log('targetID: ' + targetID);

    $scope.img_contactEmail = '';
    $scope.img_contactPhone = '';

    $scope.emailSent = false;
    $scope.selectedContactInformation = '';
    $scope.phoneSelected = null;
    $scope.emailSelected = false;
    $scope.emailMessage = 'Email';

    $scope.selectedPropertyImage = '';
    $scope.selectedPropertyIdx = 0;


    function compareQuestions() {

      QuestionsListing.getQuestions({},
      function(res) {
        $scope.questionsListing = res.questionsListing;
        $scope.roommateQuestions = $scope.apartmate.questionsResults;
        $scope.userQuestions = $rootScope.user.questionsResults;

        angular.forEach($scope.roommateQuestions, function(value, key){
          $scope.roommateQuestions[key].result = $scope.questionsListing[key].options[parseInt(value.answer)].name;
        });

        angular.forEach($scope.userQuestions, function(value, key){
          $scope.userQuestions[key].result = $scope.questionsListing[key].options[parseInt(value.answer)].name;
        });

        console.log($scope.questionsListing);        
        console.log($scope.roommateQuestions);
      },
      function(err) {
        $rootScope.error = err.message;
      });
    }

    if (!$rootScope.apartmate)
    {
        console.log('rootscope apartmate is still empty');
        try {

            ApartmateProfile.getApartmateProfile({
                _id: targetID
            },
            function(res) {
                console.log(res.user);

                $scope.apartmate = res.user;
                $scope.apartmate.src = $scope.apartmate.addedProfileImages[0].url;
                $scope.apartmate.description = $scope.apartmate.personalDescription;
                $scope.apartmate.gender = $scope.apartmate.selectedGender;
                $scope.apartmate.description = $scope.apartmate.personalDescription;

                var facebookVerified = false;
                var linkedInVerified = false;
                if ($scope.apartmate.provider.length > 0)
                {
                    for (var p = 0; p < $scope.apartmate.provider.length; p++)
                    {
                        if ($scope.apartmate.provider[p].name === 'facebook')
                           facebookVerified = true;

                        if ($scope.apartmate.provider[p].name === 'linkedin')
                            linkedInVerified = true;
                    }
                
                }
                $scope.apartmate.facebookVerified = facebookVerified;
                $scope.apartmate.linkedInVerified = linkedInVerified;
                if($rootScope.user.emailAddress != ''){
                    compareQuestions();
                }

            },
            function(err) {
                $rootScope.error = err.message;
            });
        }
        catch(err) {
            $rootScope.error = err.message;
        }
       
    } else {
        $scope.apartmate = $rootScope.apartmate;
        console.log($scope.apartmate);
        if($rootScope.user.emailAddress != ''){
            compareQuestions();
        }

        // var facebookVerified = false;
        // var linkedInVerified = false;
        // if ($scope.apartmate.provider.length > 0)
        // {
        //     for (var p = 0; p < $scope.apartmate.provider.length; p++)
        //     {
        //         if ($scope.apartmate.provider[p].name === 'facebook')
        //             facebookVerified = true;

        //         if ($scope.apartmate.provider[p].name === 'linkedIn')
        //             linkedInVerified = true;
        //     }
        
        // }
        // console.log('apartmate image: ' + $scope.apartmate.src);
        // console.log('first name: ' + $scope.apartmate.firstName);
        // console.log('first name: ' + $scope.apartmate.description);



        $scope.selectedProfileImage = $scope.apartmate.src;
    }


    $scope.verifyLinkedIn = function()
    {
      console.log("verifyLinkedIn");
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
            $scope.emailMessage = $scope.apartmate.emailAddress;
            //$scope.phoneMessage = '          ' + $scope.phoneMessage;
            // $scope.sendEmail($scope.property.email, $scope.property.title, '');
        }

    }

    $scope.sendEmail = function(email, subject, body) {

        $scope.selectedContactInformation = $scope.property.email;

        var link = "mailto:"+ email
                 + "?subject=New%20email " + escape(subject);

        window.location.href = link;
     };

   

    try {


    } catch(err) {
            $rootScope.error = err.message;
    }
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];



    $scope.getApartmateDetail = function()
    {
        console.log('getApartmateDetail');
        try {

            ApartmateProfile.getApartmateListing({
                _id: $scope.apartmateId

            },
            function(res) {
                console.log('id: ' + res.apartmate._id);
                $rootScope.apartmate = res.apartmate;
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

    $scope.backToRoommateListings = function(){
        $rootScope.propertyType = 'Apartmate';
        $rootScope.hackBack = true;
        $location.path('/search');
        // $state.transitionTo('public.nav.search', $stateParams, {
        //   reload: true,
        //   inherit: false,
        //   notify: true
        // });
    };

    $scope.fbShare = function() {
       FB.ui({
        method: 'feed',
        link: baseUrl + '/roommate/' + $scope.apartmate._id,
        caption: "Room Wanted",
        description: $scope.apartmate.description
      }, function(response){
        console.log(response);
      });
    };
    
    $scope.toggleAnswers = function() {
        $scope.showQuestions = !$scope.showQuestions;
    };

}]);

