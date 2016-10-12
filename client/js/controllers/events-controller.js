angular.module('angular-client-side-auth')
.controller('EventsCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', '$http', function($rootScope, $scope, $location, $window, Auth, $http) {
    $rootScope.seo = {
      title: "Apartmate | Events",
      description: "Apartmate pub nights are for people who are looking for somewhere to live or someone to live with"
    };

    $http.get('http://www.apartmate.ca:5000/index.php/api/get_page/?slug=event')
    .success(function(data, status, headers, config){

        var eventMixer = data.page.custom_fields;
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        var dateString  = eventMixer.date[0];
        // var dateString  = "20151127";

        var year        = dateString.substring(0,4);
        var month       = dateString.substring(4,6);
        var day         = dateString.substring(6,8);
        var date        = new Date(year, month-1, day).setHours(0,0,0,0);
        var currentDate = new Date().setHours(0,0,0,0);


        $rootScope.event = {};
        $rootScope.event.dateFuture = (date >= currentDate)? true: false;
        $rootScope.event.date = monthNames[dateString.substring(4,6) - 1] + " " + day + ", " + year;
        $rootScope.event.time = eventMixer.event_time[0];
        $rootScope.event.link = eventMixer.link[0];
        $rootScope.event.address = eventMixer.address[0];
        
    })
    .error(function(data, status, headers, config){
        window.alert("We have been unable to access the feed :-(");
    });


    $scope.tickets = function()
    {
        $window.open('http://www.eventbrite.ca/e/toronto-roommate-mixer-tickets-17974050870');
        //$location.path("");
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
}]);

