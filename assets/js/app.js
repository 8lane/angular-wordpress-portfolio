// @codekit-prepend "angular.min.js"
// @codekit-prepend "angular-route.js"
// @codekit-prepend "angular-sanitize.js"

var myApp = angular.module('tomsApp', ["ngRoute","ngSanitize"])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:'pages/home.html',
		data : { pageTitle: 'Home | Tom Christian' }
	})
	.when('/portfolio/:projectId', {
		controller:'projectController',
		templateUrl:'pages/project.html',
		data : { pageTitle: 'Project | Tom Christian' }
	})
	.when('/tags/:tagId', {
		controller:'tagsController',
		templateUrl:'pages/tags.html',
		data : { pageTitle: 'Tags | Tom Christian' }
	})
	.otherwise({
		redirectTo:'/',
		data : { pageTitle: 'Home | Tom Christian' }
	});
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
		baseURL = 'http://dev/portfoliov4/wordpress/wp-json/';

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

	$scope.title = function(input) {
		return appTitle.set(input);
	};

	$scope.siteInfo = {};
	$scope.options = {
		query: {
			site: "",
			posts: "posts?filter[posts_per_page]=8&filter[order]=DATE"
		},
		authorInfo: "Creator of <a target='_blank' href='http://ipsthemes.com'>IPS Themes</a> & <a target='_blank' href='http://xenthemes.com'>Xenthemes</a>.",
	};

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
		});
	});
})

.controller('projectController', function($scope, $routeParams, appTitle) {
	$scope.projectId = $routeParams.projectId.split('-').pop().trim();
})

.controller('tagsController', function($scope, $rootScope, $routeParams, appTitle) {
	$scope.tag = {};
	$scope.tag.name = $routeParams.tagId;
})

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
		var data = [];
		angular.forEach(input, function(item) {
			if(item.ID == search.ID){
				data.push(item);
			}
		});
		return data;
	}
})

.filter('objByTag', function($filter) {
	return function(input, search) {
		var data = [];
		angular.forEach(input, function(item) {
			angular.forEach(item.terms.post_tag, function(tag) {
				if(tag.name == search.tag){
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
				data.push(tag.name);
			});
		});

		var uniqueArray = data.filter(function(item, pos) {
		    return data.indexOf(item) == pos;
		})

		return uniqueArray;
	}
})

.filter('cleanUrl',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();    
        }
    }
});