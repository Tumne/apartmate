angular.module('angular-client-side-auth')
.controller('BoostModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'status', 'Auth', 'baseUrl', 'ApartmateProfile', function($rootScope, $scope, $location, $window, $modalInstance, status, Auth, baseUrl, ApartmateProfile) {
  
  console.log(status);
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  

  $scope.fbBoost = function() {

    FB.ui({
      method: 'feed',
      link: baseUrl + '/property/' + status._id,
      picture: status.allImages[0].url,
      caption: status.title,
      description: status.description
    }, function(response){
      if(typeof response != "undefined"){
        ApartmateProfile.updateFBBoost({
          id: status._id,
        },
        function(res) {
            console.log(res);
            $modalInstance.close();
        },
        function(err) {
            console.log(err);
        });
      } else {
        $modalInstance.dismiss('cancel');
      }
      
    });
  };

}]);

