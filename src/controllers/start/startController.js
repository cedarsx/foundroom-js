'use strict';

angular.module('foundroom.start', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'controllers/start/start.html',
				controller: 'startController'
			})
	}])
	.controller('startController', ['$timeout', '$location', '$rootScope',
		function($timeout, $location, $rootScope) {

			var self = this;

			activate();

			///

			function activate() {
				$('#start').fadeIn(400);
			}

	}]);