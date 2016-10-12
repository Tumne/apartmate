
angular.module('angular-client-side-auth')
.controller('AdviceArticleCtrl', ['$rootScope', '$scope', '$window', '$location', 'Auth', '$modal', '$log', '$cookieStore', '$state', 'baseUrl', '$http', '$stateParams', function($rootScope, $scope, $window, $location, Auth, $modal, $log, $cookieStore, $state, baseUrl, $http, $stateParams) {
    
    console.log($stateParams);
    $scope.url = baseUrl + $location.path();

    $rootScope.fbURL = baseUrl + $location.path();
    // $rootScope.fbTitle = $('.article-title').html();
    // $rootScope.fbDesc = $('.article-content').html();
    $rootScope.slug = $location.path().split('/advice/')[1].split('/')[0];
    // $rootScope.fbIMG = baseUrl + "/img/advice/" + $location.path().split('/advice/')[1].split('/')[1].replace(/-/g, '_') + "_800x500.jpg";
    $rootScope.fbIMG = $('.article-img').attr('src');

    $scope.backToTop = function(){
         $("html, body").animate({scrollTop: 0}, 500);
    };

    $scope.fbShare = function() {
      FB.ui({
        method: 'feed',
        link: baseUrl + $location.path(),
        name: $('.article-title').html(),
        caption: 'Apartmate',
        picture: $('.article-img').attr('src'),
        description: $('.article-content').html()
      }, function(response){
        console.log(response);
      });
    };

}]);


