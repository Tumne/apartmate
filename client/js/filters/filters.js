angular.module('angular-client-side-auth')
.filter('toSec', [ '$filter', function($filter) {
  return function(input) {
    var result = new Date(input).getTime();
    return result || '';
  };
}]);