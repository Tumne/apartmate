angular.module('angular-client-side-auth')
.controller('QuestionsModalCtrl',
['$rootScope', '$scope', '$location', '$window', '$modalInstance', 'questions', 'Auth', 'QuestionsListing', function($rootScope, $scope, $location, $window, $modalInstance, questions, Auth, QuestionsListing) {

  $scope.questions = questions;
  console.log($scope.questions);
  $scope.qIndex = 0;
  var completed = false;

  function initAnswerInput(){
    
    angular.forEach($scope.questions[$scope.qIndex].options, function (item) {
      item.selected = false;
    });
    $scope.result = {
      qid: $scope.questions[$scope.qIndex].qid,
      answer:null,
      acceptable: [],
      importance: null
    };
  }

  initAnswerInput();

  $scope.submitQuestion = function(){

    if($scope.questions.length  - 1 ==  $scope.qIndex) completed = true;

    QuestionsListing.addQuestionById({
      email: $rootScope.user.emailAddress,
      result: $scope.result,
      completed: completed
    },
    function(res) {
        
        console.log(res.propertySaved);
        console.log(res.userSaved);

        if($scope.qIndex < $scope.questions.length - 1){
          $scope.qIndex++;
          initAnswerInput();
        } else {
          console.log("close modal");
          $modalInstance.close();
        }
    },
    function(err) {
      $rootScope.error = err.message;
    });


    
  };

  $scope.clickAcceptable = function(_id, $event){
    var checkbox = $event.target;
    if(checkbox.checked){
      $scope.result.acceptable.push({"id": _id});
    } else {

      var i = -1;
      angular.forEach($scope.result.acceptable, function(value, key){
        if(value.id == _id){
          i = key;
        }
      });
      if(i != -1 ) {
        $scope.result.acceptable.splice(i, 1);
      }
    }
  };

  $scope.clickImportance = function(_value){
    console.log(_value);
    $scope.result.importance = _value;
  };

  

  $scope.ok = function () {
    $modalInstance.close();
  };



  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  

}]);

