// 'use strict';


angular.module('angular-client-side-auth',
    [
        'ngCookies', 'ui.router', 'ui.bootstrap', 'flow', "wu.masonry",
        "angular-wurfl-image-tailor", "truncate", 'leaflet-directive',
        'ui.bootstrap.datetimepicker', 'uiSlider', 'pageslide-directive',
    ]
)

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'flowFactoryProvider', '$logProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, flowFactoryProvider, $logProvider) {

    var access = routingConfig.accessLevels;

    var _isNotMobile = (function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return !check;
    })();

    flowFactoryProvider.defaults = {
        target: '/properties/api/upload',
        permanentErrors: [415, 500, 501, 503],
        chunkSize: 5 * 1024 * 1024,
        maxChunkRetries: 3,
        chunkRetryInterval: 5000,
        simultaneousUploads: 1
    };

    // You can also set default events:
    flowFactoryProvider.on('catchAll', function (event) {
        console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    // flowFactoryProvider.factory = fustyFlowFactory;

    $logProvider.debugEnabled(false);

    // Public routes
    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        })
        .state('public.404', {
            url: '/404/',
            templateUrl: '404'
        });

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        .state('public.nav', {
            url: '',
            templateUrl: (_isNotMobile )? 'nav':'mobilenav',
            controller: 'NavCtrl' //(_isNotMobile )?'NavCtrl':'MobileNavCtrl'
        })
        .state('public.nav.home', {
            url: '/?email&token',
            templateUrl: 'home', //(_isNotMobile )? 'home':'mobilehome',
            controller: 'HomeCtrl'
        })
        .state('public.nav.tos', {
            url: '/tos/',
            templateUrl: 'tos',
            controller: 'HomeCtrl'
        })
        .state('public.nav.privacy', {
            url: '/privacy/',
            templateUrl: 'privacy',
            controller: 'HomeCtrl'
        })
        .state('anon.nav.login', {
            url: '/',
            templateUrl: 'login',
            controller: 'LoginCtrl'
        })
        .state('public.nav.about', {
            url: '',
            templateUrl: 'about',
            controller: 'HomeCtrl'
        })
        .state('public.nav.about.main', {
            url: '/main',
            templateUrl: 'about/main',
            controller: 'HomeCtrl'
        })
        .state('public.nav.about.blog', {
            url: '/blog',
            templateUrl: 'blog',
            controller: 'BlogListCtrl'
        })
        .state('public.nav.about.blogpost', {
            url: '/blog/:slug',
            templateUrl: 'blogpost',
            controller: 'BlogPostCtrl'
        })
        .state('public.nav.about.tos', {
            url: '/tos',
            templateUrl: 'tos',
            controller: 'HomeCtrl'
        })
        .state('public.nav.about.privacy', {
            url: '/privacy',
            templateUrl: 'privacy',
            controller: 'HomeCtrl'
        })

        // Advice
        .state('public.nav.advice', {
            // abstract: true,
            url: '/advice',
            templateUrl: (_isNotMobile )? 'advice/menu': 'advice/mobilemenu',
            controller: (_isNotMobile )? 'AdviceCtrl' : 'MobileAdviceCtrl'
        })
        .state('public.nav.advice.renters', {
            url: '/renters',
            templateUrl: (_isNotMobile )? 'advice/renters/menu' :'advice/renters/mobilemenu',
            controller: 'AdviceRentersCtrl'
        })
        .state('public.nav.advice.renters.article', {
            // abstract: true,
            url: '/:slug',
            templateUrl: (_isNotMobile )? 'advice/renters/article' :'advice/renters/mobilearticle',
            controller: 'AdviceArticleCtrl'
        })
        .state('public.nav.advice.roommates', {
            url: '/roommates',
            // templateUrl: 'advice/roommates/menu',
            templateUrl: (_isNotMobile )? 'advice/roommates/menu' :'advice/roommates/mobilemenu',
            controller: 'AdviceRoommatesCtrl'
        })
        .state('public.nav.advice.roommates.article', {
            // abstract: true,
            url: '/:slug',
            // templateUrl: 'advice/roommates/article',
            templateUrl: (_isNotMobile )? 'advice/roommates/article' :'advice/roommates/mobilearticle',
            controller: 'AdviceArticleCtrl'
        })
        .state('public.nav.advice.landlords', {
            url: '/landlords',
            // templateUrl: 'advice/landlords/menu',
            templateUrl: (_isNotMobile )? 'advice/landlords/menu' :'advice/landlords/mobilemenu',
            controller: 'AdviceLandlordsCtrl'
        })
        .state('public.nav.advice.landlords.article', {
            // abstract: true,
            url: '/:slug',
            // templateUrl: 'advice/landlords/article',
            templateUrl: (_isNotMobile )? 'advice/landlords/article' :'advice/landlords/mobilearticle',
            controller: 'AdviceArticleCtrl'
        })


        .state('public.nav.events', {
            url: '/events',
            templateUrl: 'events',
            controller: 'EventsCtrl'
        })
        .state('anon.forgot', {
            url: '/forgot/',
            templateUrl: 'forgot',
            controller: 'ForgotPasswordCtrl'
        })
        .state('anon.reset', {
            url: '/reset',
            templateUrl: 'reset',
            controller: 'ResetPasswordCtrl'
        })
        .state('public.nav.property', {
            url: '/property/:id',
            templateUrl: (_isNotMobile )? 'property/home': 'property/mobilehome',
            controller: 'ViewPropertyCtrl'
        })
        .state('user.nav.property_listing', {
            url: '/property_listing/:id',
            templateUrl: 'property_listing/home',
            controller: 'ViewPropertyListingCtrl'
        })
        .state('public.nav.roommate', {
            // abstract: true,
            url: '/roommate/:id',
            templateUrl: (_isNotMobile )? 'roommate/home':'roommate/home',
            // templateUrl: (_isNotMobile )? 'roommate/layout':'roommate/layout',
            controller: (_isNotMobile )? 'ViewRoommateCtrl':'ViewRoommateCtrl'
        })
        // .state('public.roommate.home', {
        //     url: '',
        //     templateUrl: (_isNotMobile )? 'roommate/home':'roommate/home'
        // })

        .state('public.nav.search', {
            url: '/search',
            templateUrl: (_isNotMobile )? 'search/home':'search/mobilehome',
            controller: (_isNotMobile )?'SearchPropertyCtrl':'MobileSearchPropertyCtrl'
        })
        .state('anon.signup', {
            url: '/signup/',
            templateUrl: 'signup',
            controller: 'SignupCtrl'
        })
        .state('anon.loginModal', {
            url: '/loginModal/',
            templateUrl: 'loginModal',
            controller: 'LoginModalCtrl'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.user
            }
        })
        .state('user.nav', {
            url: '',
            templateUrl: (_isNotMobile )? 'nav':'mobilenav', // (_isNotMobile )? 'home':'mobilehome',
            controller: "NavCtrl" // (_isNotMobile )?'HomeCtrl':'MobileHomeCtrl'
        })
        .state('user.about', {
            url: '/about',
            templateUrl: 'about',
            controller: 'HomeCtrl'
        })
        .state('user.advice', {
            url: '/advice',
            templateUrl: 'advice',
            controller: 'HomeCtrl'
        })
        .state('user.events', {
            url: '/events',
            templateUrl: 'events',
            controller: 'EventCtrl'
        })
        .state('user.nav.listings', {
            url: '/listings',
            templateUrl: (_isNotMobile )? 'listings/home':'listings/mobilehome',
            controller: (_isNotMobile )?'ViewListingsCtrl':'MobileViewListingsCtrl'
        })
        .state('user.nav.my_profile', {
            // abstract: true,
            url: '/my_profile',
            // templateUrl: 'my_profile/layout',
            templateUrl:'my_profile/home',
            controller: 'MyProfileCtrl'
        })
        .state('user.my_profile.home', {
            url: '',
            templateUrl:'my_profile/home'
        })
        .state('user.confirmModal', {
            url: '/confirmModal/',
            templateUrl: 'confirmModal',
            controller: 'ConfirmModalCtrl'
        })
        .state('user.nav.favorites', {
            url: '/favorites',
            // templateUrl: (_isNotMobile )? 'favorites/layout':'favorites/mobilelayout',
            templateUrl: 'favorites/home',
            controller: 'ViewFavoritesCtrl'
        })
        // .state('user.favorites.home', {
        //     url: '',
        //     templateUrl: (_isNotMobile )? 'favorites/home':'favorites/mobilehome'
        // })
        .state('user.nav.favorite_property', {
            // abstract: true,
            url: '/favorite_property/:id',
            templateUrl: 'favorite_property/home',
            controller: 'ViewFavoritePropertyCtrl'
        })
        // .state('user.favorite_property.home', {
        //     url: '',
        //     templateUrl: 'favorite_property/home'
        // })
        .state('user.offering', {
            abstract: true,
            url: '/offering/',
            templateUrl: 'offering/layout'
        })
        .state('user.offering.home', {
            url: '',
            templateUrl: 'offering/home'
        })
        .state('user.offering.nested', {
            url: 'nested/',
            templateUrl: 'offering/nested'
        })
        .state('user.nav.roommateProfile_part1', {
            // abstract: true,
            url: '/roommateProfile_part1/',
            // templateUrl: 'roommateProfile_part1/layout',
            templateUrl: 'roommateProfile_part1/home',
            controller: "AddApartmateProfileCtrl",
            data: {
                access: access.user
            }
        })
        // .state('user.roommateProfile_part1.home', {
        //     url: '',
        //     templateUrl: 'roommateProfile_part1/home',
        //     controller: "AddApartmateProfileCtrl"
        // })
        .state('user.nav.roommateProfile_part2', {
            // abstract: true,
            url: '/roommateProfile_part2/',
            // templateUrl: 'roommateProfile_part2/layout',
            templateUrl: 'roommateProfile_part2/home',
            controller: "AddApartmateProfileCtrl"
        })
        // .state('user.roommateProfile_part2.home', {
        //     url: '',
        //     templateUrl: 'roommateProfile_part2/home',
        //     controller: "AddApartmateProfileCtrl"
        // })
        .state('user.sharedSearch_part1', {
            abstract: true,
            url: '/sharedSearch_part1/',
            templateUrl: 'sharedSearch_part1/layout',
            controller: "AddSharedSearchProfileCtrl",
            data: {
                access: access.user
            }
        })
        .state('user.sharedSearch_part1.home', {
            url: '',
            templateUrl: 'sharedSearch_part1/home',
            controller: "AddSharedSearchProfileCtrl"
        })
        .state('user.sharedSearch_part2', {
            abstract: true,
            url: '/sharedSearch_part2/',
            templateUrl: 'sharedSearch_part2/layout',
            controller: "AddSharedSearchProfileCtrl"
        })
        .state('user.sharedSearch_part2.home', {
            url: '',
            templateUrl: 'sharedSearch_part2/home',
            controller: "AddSharedSearchProfileCtrl"
        })
        .state('user.nav.addProperty', {
            // abstract: true,
            url: '/addProperty/',
            templateUrl: 'addProperty/home',
            // templateUrl: 'addProperty/layout',
            controller: "AddPropertyCtrl"
        })
        // .state('user.addProperty.home', {
        //     url: '',
        //     templateUrl: 'addProperty/home',
        //     controller: "AddPropertyCtrl"
        // })
        .state('user.nav.part2', {
            // abstract: true,
            url: '/part2/',
            // templateUrl: 'part2/layout',
            templateUrl: 'part2/home',
            controller: "AddPropertyCtrl"
        })
        // .state('user.part2.home', {
        //     url: '',
        //     templateUrl: 'part2/home',
        //     controller: "AddPropertyCtrl"
        // })
        .state('user.nav.part3', {
            // abstract: true,
            url: '/part3/',
            templateUrl: 'part3/home',
            // templateUrl: 'part3/layout',
            controller: "AddPropertyCtrl"
        })
        // .state('user.part3.home', {
        //     url: '',
        //     templateUrl: 'part3/home',
        //     controller: "AddPropertyCtrl"
        // })

        //Edit      
        .state('user.nav.edit_roommate', {
            // abstract: true,
            url: '/edit_roommate/',
            templateUrl: 'edit_roommate/home',
            // templateUrl: 'edit_roommate/layout',
            controller: "EditRoommateCtrl"
        })
        // .state('user.edit_roommate.home', {
        //     url: '',
        //     templateUrl: 'edit_roommate/home',
        //     controller: "EditRoommateCtrl"
        // })

        .state('user.nav.edit_roommate_part2', {
            // abstract: true,
            url: '/edit_roommate_part2/',
            templateUrl: 'edit_roommate_part2/home',
            // templateUrl: 'edit_roommate_part2/layout',
            controller: "EditRoommateCtrl"
        })
        // .state('user.edit_roommate_part2.home', {
        //     url: '',
        //     templateUrl: 'edit_roommate_part2/home',
        //     controller: "EditRoommateCtrl"
        // })

        .state('user.nav.editProperty', {
            // abstract: true,
            url: '/editProperty/',
            // templateUrl: 'editProperty/layout',
            templateUrl: 'editProperty/home',
            controller: "EditPropertyCtrl"
        })
        // .state('user.editProperty.home', {
        //     url: '',
        //     templateUrl: 'editProperty/home',
        //     controller: "EditPropertyCtrl"
        // })


        .state('user.nav.edit_part2', {
            // abstract: true,
            url: '/edit_part2/',
            // templateUrl: 'edit_part2/layout',
            templateUrl: 'edit_part2/home',
            controller: "EditPropertyCtrl"
        })
        // .state('user.edit_part2.home', {
        //     url: '',
        //     templateUrl: 'edit_part2/home',
        //     controller: "EditPropertyCtrl"
        // })
        .state('user.nav.edit_part3', {
            // abstract: true,
            url: '/edit_part3/',
            // templateUrl: 'edit_part3/layout',
            templateUrl: 'edit_part3/home',
            controller: "EditPropertyCtrl"
        })
        // .state('user.edit_part3.home', {
        //     url: '',
        //     templateUrl: 'edit_part3/home',
        //     controller: "EditPropertyCtrl"
        // })

        .state('user.nav.shared_part1', {
            // abstract: true,
            url: '/shared_part1/',
            // templateUrl: 'shared_part1/layout',
            templateUrl: 'shared_part1/home',
            controller: "AddSharedPropertyCtrl"
        })
        // .state('user.shared_part1.home', {
        //     url: '',
        //     templateUrl: 'shared_part1/home',
        //     controller: "AddSharedPropertyCtrl"
        // })
        .state('user.nav.shared_part2', {
            // abstract: true,
            url: '/shared_part2/',
            // templateUrl: 'shared_part2/layout',
            templateUrl: 'shared_part2/home',
            controller: "AddSharedPropertyCtrl"
        })
        // .state('user.shared_part2.home', {
        //     url: '',
        //     templateUrl: 'shared_part2/home',
        //     controller: "AddSharedPropertyCtrl"
        // })
        .state('user.nav.shared_part3', {
            // abstract: true,
            url: '/shared_part3/',
            // templateUrl: 'shared_part3/layout',
            templateUrl: 'shared_part3/home',
            controller: "AddSharedPropertyCtrl"
        })
        // .state('user.shared_part3.home', {
        //     url: '',
        //     templateUrl: 'shared_part3/home',
        //     controller: "AddSharedPropertyCtrl"
        // })

        // Edit Shared
        .state('user.nav.edit_shared_part1', {
            // abstract: true,
            url: '/edit_shared_part1/',
            // templateUrl: 'edit_shared_part1/layout',
            templateUrl: 'edit_shared_part1/home',
            controller: "EditSharedPropertyCtrl"
        })
        // .state('user.edit_shared_part1.home', {
        //     url: '',
        //     templateUrl: 'edit_shared_part1/home',
        //     controller: "EditSharedPropertyCtrl"
        // })
        .state('user.nav.edit_shared_part2', {
            // abstract: true,
            url: '/edit_shared_part2/',
            // templateUrl: 'edit_shared_part2/layout',
            templateUrl: 'edit_shared_part2/home',
            controller: "EditSharedPropertyCtrl"
        })
        // .state('user.edit_shared_part2.home', {
        //     url: '',
        //     templateUrl: 'edit_shared_part2/home',
        //     controller: "EditSharedPropertyCtrl"
        // })
        .state('user.nav.edit_shared_part3', {
            // abstract: true,
            url: '/edit_shared_part3/',
            templateUrl: 'edit_shared_part3/home',
            // templateUrl: 'edit_shared_part3/layout',
            controller: "EditSharedPropertyCtrl"
        })
        // .state('user.edit_shared_part3.home', {
        //     url: '',
        //     templateUrl: 'edit_shared_part3/home',
        //     controller: "EditSharedPropertyCtrl"
        // })

        .state('user.private', {
            abstract: true,
            url: '/private/',
            templateUrl: 'private/layout'
        })
        .state('user.private.home', {
            url: '',
            templateUrl: 'private/home'
        })
        .state('user.private.nested', {
            url: 'nested/',
            templateUrl: 'private/nested'
        })
        .state('user.private.admin', {
            url: 'admin/',
            templateUrl: 'private/nestedAdmin',
            data: {
                access: access.admin
            }
        });

    // Admin routes
    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        })
        .state('admin.admin', {
            url: '/admin/',
            templateUrl: 'admin',
            controller: 'AdminCtrl'
        });


    $urlRouterProvider.otherwise('/404');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function($injector, $location) {
        if($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    
    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    //$location.path('/login');
                    
                }
                return $q.reject(response);
            }
        };
    });

}])

.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart - event: ' + event);
        console.log('$stateChangeStart - fromState: ' + fromState.url);
        console.log('$stateChangeStart - toState: ' + toState.url);

        if(!('data' in toState) || !('access' in toState.data)){
            console.log('Access undefined for this state');
            $rootScope.error = "Access undefined for this state";
            event.preventDefault();
        }
        else if (!Auth.authorize(toState.data.access)) {
            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
            event.preventDefault();
        }
    });
    // Quick fix: Turn off console.log
    // console.log = function() {};

    mixpanel.track("Video play");

    $rootScope.initHackProperties = false;
    $rootScope.$on('loginEventEmit', function(event, args) {
        $rootScope.$broadcast('loginEventBroadcast', args);
    });

    $rootScope.$on('initialLoginEventEmit', function(event, args) {
        $rootScope.$broadcast('initialLoginEventBroadcast', args);
    });

    $rootScope.$on('mobileFilterEventEmit', function(event, args) {
        $rootScope.$broadcast('mobileFilterEventBroadcast', args);
    });

    $rootScope.$on('FBLoginEventEmit', function(event, args) {
        $rootScope.$broadcast('FBLoginEventBroadcast', args);
    });

    $rootScope.$on('RoommateProfileCreatedEmit', function(event, args) {
        $rootScope.$broadcast('RoommateProfileCreatedBroadcast', args);
    });

    $rootScope.$on('MatchmakingQuestionsEmit', function(event, args) {
        $rootScope.$broadcast('MatchmakingQuestionsBroadcast', args);
    });
    
    $rootScope.$on('showBackButtonEmit', function(event, args) {
        $rootScope.$broadcast('showBackButtonBroadcast', args);
    });

}]);
