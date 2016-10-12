angular.module('angular-client-side-auth')
.controller('CreatedQuestionsModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'status', 'Auth', 'baseUrl', 'ApartmateProfile', 'QuestionsListing', function($rootScope, $scope, $location, $window, $modalInstance, status, Auth, baseUrl, ApartmateProfile, QuestionsListing) {
  

  function initCreatedQuestion() {
    $scope.createdQuestion.question = '';
    $scope.createdQuestion.option1 = '';
    $scope.createdQuestion.option2 = '';
    $scope.createdQuestion.option3 = '';
    $scope.createdQuestion.option4 = '';
  }

  console.log(status);
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.addQuestion = function() {
    $scope.createdQuestion.apartmate = status;
    // send question
    console.log($scope.createdQuestion);
    QuestionsListing.addCreatedQuestion({
      createdQuestion: $scope.createdQuestion
    },
    function(res) {
        console.log(res);
        initCreatedQuestion();
    },
    function(err) {
        console.log(err);
    });

  };

}]);

