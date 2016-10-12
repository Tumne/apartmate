'use strict';

angular.module('angular-client-side-auth')
.directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                //if(user && user.role)
                    //console.log('user.role: ' + user.role);

                if(user && user.role)
                {
                    //console.log('if - accessLevel: ' + accessLevel.anon);
                   // console.log('if userRole: ' + userRole);
                    userRole = user.role;
                } else {
                    //console.log('else - accessLevel: ' + accessLevel.anon);
                    //console.log('else userRole: ' + userRole);
                    // var accessLevels = routingConfig.accessLevels
                      //  , userRoles = routingConfig.userRoles
                    user = { emailAddress: '', username: '', role: userRoles.public };
                    accessLevel = routingConfig.accessLevels;
                    userRole = routingConfig.userRoles;
                    console.log('userRole: ' + userRole);
                    //console.log('inspect: ' + inspect(accessLevel));
                    //element.css('display', 'none');
                }
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);