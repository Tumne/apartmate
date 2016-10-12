angular.module('angular-client-side-auth')
.controller('BlogPostCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', '$modal', '$state', '$stateParams', 'baseUrl', '$http', '$sce', function($rootScope, $scope, $location, $window, Auth, $modal, $state, $stateParams, baseUrl, $http, $sce) {

    console.log($stateParams.slug);
    $scope.url = baseUrl + $location.path();
    $rootScope.fbURL = baseUrl + $location.path();
    

    $scope.$emit('showBackButtonEmit', {});

    $http.get('http://www.apartmate.ca:5000/index.php/api/get_post/?slug=' + $stateParams.slug)
    .success(function(data, status, headers, config){
        console.log(data);

        $scope.post = data.post;
        $scope.comments = data.post.comments;

        $rootScope.fbIMG = data.post.thumbnail;
        $rootScope.fbTitle = data.post.title;
        $rootScope.fbDesc = data.post.content.split("<p>")[1].split("</p>")[0].replace(/\u00a0/g, " ");

        // Inject the title into the rootScope
    })
    .error(function(data, status, headers, config){
        window.alert("We have been unable to access the feed :-(");
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.fbShare = function(title, thumbnail, content) {
      console.log(baseUrl + $location.path());
      // console.log(title, thumbnail, $(content).text().split('… Continue')[0]);
      FB.ui({
        method: 'feed',
        link: baseUrl + $location.path(),
        name: title,
        caption: "Apartmate",
        picture: thumbnail,
        description: $(content).text().split('… Continue')[0]
      }, function(response){
        console.log(response);
      });
    };

}]);

