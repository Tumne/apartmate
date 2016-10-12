angular.module('angular-client-side-auth')
.controller('BlogListCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', '$modal', '$state', '$stateParams', 'baseUrl', '$http', '$sce', function($rootScope, $scope, $location, $window, Auth, $modal, $state, $stateParams, baseUrl, $http, $sce) {

    // $http.get('http://www.apartmate.ca:5000/index.php/api/get_page/?slug=about')
    // .success(function(data, status, headers, config){
    //     $scope.page = data.page;
    //     console.log(data.page);
        
    // })
    // .error(function(data, status, headers, config){
    //     window.alert("We have been unable to access the feed :-(");
    // });
    
    $rootScope.seo = {
      title: "Apartmate | Blog",
      description: "Everything you need to know about renting in Toronto"
    };
  
    $scope.url = baseUrl;

    if($stateParams.category) {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        console.log("category");
        var url = $http.get('http://www.apartmate.ca:5000/index.php/api/get_category_posts/?slug=' + $stateParams.category);
    } else {
        if($stateParams.page) {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            console.log($stateParams.page);
            console.log("page parameter");
            var url = $http.get('http://www.apartmate.ca:5000/index.php/api/get_posts/?page=' + $stateParams.page);
        } else {
            /**
             *  If no parameter supplied, just get all posts
             */
            console.log("get all blog posts");
            // var url = $http.get('http://www.apartmate.ca:5000/index.php/api/get_posts');
            var url = $http.get('http://www.apartmate.ca:5000/index.php/api/get_category_posts/?slug=blog');


            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;

            // Inject the title into the rootScope
            $rootScope.title = 'Blog';
        }
    }

    url
    .success(function(data, status, headers, config){
        /**
         *  Pass data from the feed to the view.
         *  $scope.posts will pass exclusively post data
         *  $scope.paging will pass the whole feed and will be used to work out paging
         */
        console.log(data);

        $scope.posts = data.posts;
        $scope.paging = data;

        // // Inject the title into the rootScope
        // $rootScope.title = data.category.title;

        // if($routeParams.page)
        // {
        //     // Get current page
        //     $scope.page = $routeParams.page;
        //     // Caluculate next/previous values
        //     $scope.next = parseInt($routeParams.page)+1;
        //     $scope.prev = parseInt($routeParams.page)-1;
        // };
    })
    .error(function(data, status, headers, config){
        window.alert("We have been unable to access the feed :-(");
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.beautyEncode = function(string){
        string = string.replace(/ /g, '-').toLowerCase();
        return string;
    };

    $scope.fbShare = function (slug, title, thumbnail, content) {
        console.log($scope.url + '/about/blog/' + slug);

        FB.ui({
          method: 'feed',
          link: $scope.url + '/about/blog/' + slug,
          name: title,
          caption: "Apartmate",
          picture: thumbnail,
          description: $(content).text().split('… Continue')[0]
        }, function(response){
          console.log(response);
        });
    };

}]);

