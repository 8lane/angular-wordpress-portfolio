var myApp = angular.module('tomsApp', ["ngRoute"])

.run(['$route', angular.noop])

.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:'pages/home.html',
		data : { pageTitle: 'Home' }
	})
	.when('/portfolio/:projectId', {
		controller:'projectController',
		templateUrl:'pages/project.html',
		data : { pageTitle: 'Project' }
	})
	.when('/tags/:tagId', {
		controller:'tagsController',
		templateUrl:'pages/tags.html',
		data : { pageTitle: 'Tags' }
	})
	.otherwise({
		redirectTo:'/',
		data : { pageTitle: 'Home' }
	});
})

.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    	if(!$rootScope.siteInfo) {
    		$rootScope.siteInfo = 'Tom Christian';
    	}
    	$rootScope.pageTitle = current.data.pageTitle;
    });
}])

.factory("WPAPI",function($http,$q){
	var data = {},
		baseURL = 'http://dev/portfoliov4/wordpress/wp-json/';

	return {
		fetch: function(query) {
           return $http.get(baseURL+query).then(function(results){
               data = results;
               return data;
           });
		},
		get: function() {
			return data;
		},
		set: function(data) {
			data = data;
		}
	}
})

.controller('mainController', function($scope,$http, WPAPI, $rootScope) {

	var siteQuery = "";
		postQuery = 'posts?filter[posts_per_page]=8&filter[order]=ASC';

	WPAPI.fetch(siteQuery).then(function(data){
		$rootScope.siteInfo = data.data;

		WPAPI.fetch(postQuery).then(function(data){
		   $scope.portfolio = data.data;
		  	WPAPI.set(data);
		});
	});

})

.controller('projectController', function($scope, $location, $rootScope, $routeParams, $http, $sce, $filter, WPAPI) {

	$scope.projectId = $routeParams.projectId.split('-').pop().trim();

	//$rootScope.title = $scope.myVar;
	//console.log($scope.myVar);
	//$routeParams.data.pageTitle = 'cool';

})

.controller('projectTitle', function($scope, $location, $rootScope, $routeParams, $http, $sce, $filter, WPAPI) {
	
	$rootScope.pageTitle = $scope.project.title;

})

.controller('portfolioController', function($scope,WPAPI) {

	//$scope.portfolio = [portfolio];
	//console.log($scope.portfolio);

})

.controller('tagsController', function($scope, $rootScope, $routeParams, WPAPI) {

	$scope.tag = {};
	$scope.tag.name = $routeParams.tagId;
	$rootScope.pageTitle = $scope.tag.name;

	//$scope.portfolio = [portfolio];
	//console.log($scope.portfolio);

})

.controller('contactController', function() {
	console.log('contact controller!');
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

.filter('raw', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
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