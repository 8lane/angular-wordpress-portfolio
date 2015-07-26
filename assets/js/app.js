// @codekit-prepend "angular.min.js"
// @codekit-prepend "angular-route.js"
// @codekit-prepend "angular-sanitize.js"
// @codekit-prepend "imagesloaded.pkgd.min.js"
// @codekit-prepend "angular-images-loaded.js"

var myApp = angular.module('tomsApp', ["ngRoute","ngSanitize","angular-images-loaded"])

.config(function($routeProvider,$locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl:'pages/home.html',
		data : { pageTitle: 'Home | Tom Christian' }
	})
	.when('/portfolio/:slug', {
		controller:'projectController',
		templateUrl:'pages/project.html',
		data : { pageTitle: 'Project | Tom Christian' }
	})
	.when('/tags/:slug', {
		controller:'tagsController',
		templateUrl:'pages/tags.html',
		data : { pageTitle: 'Tags | Tom Christian' }
	})
	.otherwise({
		redirectTo:'/',
		data : { pageTitle: 'Home | Tom Christian' }
	});

	$locationProvider.html5Mode(false);

})

.run(['$location', '$rootScope', '$route', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if (current.hasOwnProperty('$$route')) {
			$rootScope.pageTitle = current.data.pageTitle;
		}
    });
}])

.factory("WPAPI",function($http, $q){
	var data = {},
		baseURL = 'http://dev/portfoliov4/wp-json/';

	return {
		fetch: function(query) {
           return $http.get(baseURL+query).then(function(results){
               data = results;
               return data;
           });
		},
		set: function(data) {
			data = data;
		}
	}
})

.factory("appTitle", function($rootScope) {
	return {
		set: function(input) {
			if($rootScope.pageTitle != input) {
				$rootScope.pageTitle = input + ' | ' + 'Tom Christian';
				return input;
			}
		}
	}
})

.controller('mainController', function($scope, $http, WPAPI, appTitle) {

	var self = this;

	$scope.title = function(input) {
		return appTitle.set(input);
	};

	$scope.siteInfo = {};
	$scope.options = {
		query: {
			site: "",
			posts: "posts?filter[posts_per_page]=20&filter[order]=DATE"
		},
		authorInfo: "Creator of <a target='_blank' href='http://ipsthemes.com'>IPS Themes</a> & <a target='_blank' href='http://xenthemes.com'>Xenthemes</a>.",
	};


  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

    // self.imgLoadedEvents = {
    //     done: function(instance) {
    //         angular.element(instance.elements[0]).addClass('loaded');
    //         $scope.imgReady = true;
    //         console.log('ready');
    //     }
    // };

    $scope.showCover = function() {
        this.coverActive = true;
    };

    $scope.hideCover = function() {
        this.coverActive = false;
    };

	WPAPI.fetch($scope.options.query.site).then(function(data){
		$scope.siteInfo = data.data;
		$scope.siteInfo.description = $scope.siteInfo.description + ' ' + $scope.options.authorInfo;

		WPAPI.fetch($scope.options.query.posts).then(function(data){
			$scope.portfolio = data.data;
			WPAPI.set(data);

			console.log('data:',data);
		});
	});
    
})

.controller('projectController', function($scope, $routeParams, appTitle) {
	$scope.projectId = $routeParams.slug;
})

.controller('tagsController', function($scope, $rootScope, $routeParams, appTitle) {
	$scope.tag = $routeParams.slug;
})

.directive('tinygif', function() {
    return {
        replace: true,
        template: '<img ng-hide="imgReady" class="tinygif pure-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />'
    }
})

.directive('lightbox', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            src: '=src'
        },
        templateUrl: "pages/lightbox.html",
        controller: function($scope) {
		    // $scope.imgLoadedEvents = {
		    //     done: function(instance) {
		    //         angular.element(instance.elements[0]).addClass('loaded');
		    //         $scope.imgReady = true;
		    //         console.log('ready');
		    //     }
		    // };
        },
        link: function($scope, element, attrs) {
        	if(attrs) {
        		$scope.thumbSrc = attrs.thumbSrc;
        		$scope.imgSrc = attrs.imgSrc;
        		$scope.imgTitle = attrs.title
        	}

	        $scope.loadImg = function() {
	        	/* Show lightbox */
	        	$scope.showImg = true;
	        };

	        $scope.hideImg = function($event) {
	        	/* Hide lightbox */
	        	if(!$event) {
	        		$scope.showImg = false;
	        	}

	        	/* Hide if ESC key pressed */
	        	if($event && $event.keyCode == 27) {
        			$scope.showImg = false;
	        	}
	        };

        },

    }
})

.directive('loader', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            src: '=src'
        },
        templateUrl: "pages/partials/imgloader.html",
        controller: function($scope) {
	        $scope.imgLoadedEvents = {
	            done: function(instance) {
	                angular.element(instance.elements[0]).addClass('loaded');
	                $scope.imgReady = true;
	            }
	        };
        },
        link: function($scope, element, attrs) {
        	if(attrs) {
        		$scope.imgSrc = attrs.imgSrc;
        		$scope.imgTitle = attrs.imgTitle
        	}     	
        }
    }
})

.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){
            $element.addClass("ng-hide-remove");
            $element.on('load', function() {
                $element.addClass("ng-hide-add");
            });
        }
    }
})

.directive('compile', ['$compile', function ($compile) {
	return function(scope, element, attrs) {
		scope.$watch(
			function(scope) {
				// watch the 'compile' expression for changes
				return scope.$eval(attrs.compile);
			},
			function(value) {
				// when the 'compile' expression changes
				// assign it into the current DOM
				element.html(value);

				// compile the new DOM and link it to the current scope.
				// NOTE: we only compile .childNodes so that
				// we don't get into infinite loop compiling ourselves
				$compile(element.contents())(scope);
			}
		);
	};
}])

.directive('listAllTags', function() {
	return {
		templateUrl: 'pages/partials/tags-all.html'
	};
})

.directive('listTags', function() {
	return {
		templateUrl: 'pages/partials/tags.html'
	};
})

.directive('tomsPortfolio', function() {
	return {
		templateUrl: 'pages/partials/layout.html'
	};
})

.filter('objByID', function($filter) {
	return function(input, search) {
		var data = [], ID = Object.keys(search);
		angular.forEach(input, function(item) {
			if(item[ID] == search[ID]){
				data.push(item);
			}
		});
		return data;
	}
})

.filter('objByTag', function($filter) {
	return function(input, search) {
		var data = [], ID = Object.keys(search);
		angular.forEach(input, function(item) {
			angular.forEach(item.terms.post_tag, function(tag) {
				if(tag[ID] == search[ID]){
					data.push(item);
				}
			});
		});
		return data;
	}
})

.filter('getAllTags', function() {
	return function(input) {
		var data = [];

		angular.forEach(input, function(item) {
			angular.forEach(item.terms.post_tag, function(tag) {
				data.push(tag.slug);
			});
		});

		var uniqueArray = data.filter(function(item, pos) {
		    return data.indexOf(item) == pos;
		})

		return uniqueArray;
	}
})