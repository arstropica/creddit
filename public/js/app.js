// Define Application Module
var app = angular.module('CRedditService', ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

// Bypass TWIG / Angular Tag Conflict
app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/:channel?', {
		templateUrl : 'main',
		controller : 'SubRedditCtrl',
		caseInsensitiveMatch : true
	}).when('/:channel/:category?', {
		templateUrl : 'main',
		controller : 'SubRedditCtrl',
		caseInsensitiveMatch : true
	});
	$locationProvider.html5Mode(true);
}]);

// ngResource Model / Method Config
app.factory('Posts', function($resource) {
	return $resource('/api/get/:channel?/:category?', null, {
		get : {
			method : 'GET',
			params : {
				channel : '@channel',
				category : '@category'
			},
			url : '/api/get/:channel/:category'
		}
	});
});

/**
 * SubReddit Content Controller
 */
app.controller("SubRedditCtrl", ['$scope', '$routeParams', '$sce', 'Posts', function($scope, $routeParams, $sce, Posts) {

	var sr = this;

	$scope.loading = true;
	$scope.posts = [];
	$scope.channel = null;
	$scope.category = null;
	$scope.search = '';
	$scope.pager = {
		before : null,
		after : null
	};
	$scope.navigation = {
		before : null,
		after : null
	};
	$scope.count = 10;

	$scope.formsubmit = function() {
		$('.nav-input').val('');
		$('#clientform').submit();
	};

	// Check if thumbnail is an image
	$scope.isImage = function(src) {
		if (src === undefined || src === null) {
			return false;
		}
		return /^http/.test(src);
	};

	// Abbreviate numbers
	$scope.n2a = function(value) {
		if (value == 0)
			return value;

		var abs = Math.abs(value), newValue = value, sign = value / abs;
		if (abs >= 1000) {
			var suffixes = ["", "k", "m", "b", "t"];
			var suffixNum = Math.floor(("" + abs).length / 3);
			var shortValue = '';
			for (var precision = 2; precision >= 1; precision--) {
				shortValue = parseFloat((suffixNum != 0 ? (abs / Math.pow(1000, suffixNum)) : abs).toPrecision(precision));
				var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
				if (dotLessShortValue.length <= 2) {
					break;
				}
			}
			if (shortValue % 1 != 0)
				shortNum = shortValue.toFixed(1);
			newValue = (sign < 0 ? '-' : '') + shortValue + suffixes[suffixNum];
		}
		return newValue;
	};

	// Description : Format unix timestamp to relative
	// time.
	$scope.timeSince = function(unix) {
		var timeStamp = new Date(unix * 1000);
		var now = new Date(), secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
		if (secondsPast < 0) {
			return 'a long time';
		}
		if (secondsPast < 60) {
			return parseInt(secondsPast) + 's';
		}
		if (secondsPast < 3600) {
			return parseInt(secondsPast / 60) + 'm';
		}
		if (secondsPast <= 86400) {
			return parseInt(secondsPast / 3600) + 'h';
		}
		if (secondsPast > 86400) {
			return parseInt(secondsPast / 3600 / 24) + ' days';
		}
	};

	$scope.getPermalink = function(post) {
		var base = 'https://reddit.com';
		if (post.permalink !== undefined) {
			return base + post.permalink;
		} else if (post.url !== undefined) {
			return post.url;
		} else {
			return '#';
		}
	};

	$scope.deliberatelyTrustContent = function(content) {
		return $sce.trustAsHtml(content);
	};

	// Description: Debug Function for displaying scope state.
	$scope.log = function() {
		console.dir($scope);
	};

	// Description: ngResource Handler for GET
	$scope.query = function() {
		var params = {
			channel : $scope.channel,
			category : $scope.category,
			before : $scope.pager.before,
			after : $scope.pager.after,
			q : $scope.search,
			count : $scope.count,
			limit : $scope.limit
		};

		Posts.get(params).$promise.then(function(data) {
			var content = [];
			if (data.output !== undefined) {
				if (data.output.after !== undefined) {
					$scope.navigation.after = data.output.after;
				}
				if (data.output.before !== undefined) {
					$scope.navigation.before = data.output.before;
				}
				if (data.output.children !== undefined) {
					data.output.children.forEach(function(v, i) {
						if (v.data !== undefined) {
							content.push(v.data);
						}
					});
					$scope.posts = content;
				}
			}
			$scope.loading = false;
		});
	};

	$scope.$on('$routeChangeSuccess', function(event, current, previous) {
		// $routeParams should be populated here
		$scope.channel = $routeParams.channel || null;
		$scope.category = $routeParams.category || null;
		$scope.search = $routeParams.q || null;
		$scope.limit = $routeParams.limit || 10;
		$scope.pager.before = $routeParams.before || null;
		$scope.pager.after = $routeParams.after || null;
		$scope.count = ($scope.pager.after || $scope.pager.before) ? 10 : 0;

		$scope.query();
	});
}]);

// Description: Sanitize Directive
app.filter('sanitize', function() {
	return function(text) {
		var clean = "";
		for (var i = 0; i < text.length; i++) {
			if (text.charCodeAt(i) <= 127) {
				clean += text.charAt(i);
			}
		}
		return clean;
	};
});

// Description: Pagination Directive
app
		.directive(
				'paginate',
				function($filter) {
					return {
						restrict : 'A',
						scope : {
							previous : '=before',
							next : '=after',
						},
						transclude : true,
						template : '<ul class="pagination"> \
							<li ng-class="(previous ? \'\' : \'disabled \') + \'page-item\'"><a title="Previous" class="page-link prev" href="javascript:;"  ng-click="mbPage(\'prev\')" tabindex="-1">Previous</a></li> \
							<li ng-class="(next ? \'\' : \'disabled \') + \'page-item\'"><a title="Next" class="page-link next" href="javascript:;" ng-click="mbPage(\'next\')">Next</a> \
							</li> \
						</ul>',
						link : function(scope /* , element, attrs */) {

							scope.mbPage = function(dir) {
								switch (dir) {
									case 'next' :
										if (scope.next !== undefined && scope.next !== null) {
											$('.nav-input').val('');
											$('input#after').val(scope.next);
											$('#clientform').submit();
										}
										break;
									case 'prev' :
										if (scope.previous !== undefined && scope.previous !== null) {
											$('.nav-input').val('');
											$('input#before').val(scope.previous);
											$('#clientform').submit();
										}
										break;
								}
							};

						}
					};
				});

// Description: Read More HREF Directive
app.directive('readMore', function($filter) {
	return {
		restrict : 'A',
		scope : {
			text : '=readMore',
			target : '@readMoreTarget',
			labelExpand : '@readMoreLabelExpand',
			labelCollapse : '@readMoreLabelCollapse',
		},
		transclude : true,
		template : '<a ng-show="isEmpty()" ng-transclude href="#" ng-click="toggleReadMore()" ng-bind="label" data-toggle="collapse" data-parent="#posts" ng-attr-data-target="target"></a>',
		link : function(scope /* , element, attrs */) {

			$(scope.target).collapse();

			scope.label = '[ ' + scope.labelExpand + ' ]';

			scope.$watch('expanded', function(expandedNew) {
				if (expandedNew) {
					scope.label = scope.labelCollapse;
				} else {
					scope.label = scope.labelExpand;
				}
			});

			scope.isEmpty = function() {
				if (scope.text === undefined || scope.text.length === 0) {
					$(scope.target).closest('.list-group-item').addClass('nocomment');
					return false;
				}
				return true;
			};

			scope.toggleReadMore = function() {
				$(scope.target).collapse('toggle');
				scope.expanded = !scope.expanded;
			};

		}
	};
});