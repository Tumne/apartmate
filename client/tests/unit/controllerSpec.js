describe('MainCtrl', function(){

  beforeEach(module('apartmateApp'));

  it('should create "phones" model with 3 phones', inject(function($controller) {
    var scope = {},
        ctrl = $controller('MainCtrl', {$scope:scope});

    expect(scope.phones.length).toBe(3);
  }));

});