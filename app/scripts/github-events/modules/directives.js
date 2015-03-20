'use strict';
	

	angular.module('githubEvents.directives', ['githubEvents.filters', 'githubEvents.controllers'])
	.directive('roGithubEvents', function (){
		return {
			restrict: 'E',
			templateUrl: 'template/github-events/github-events.html',
			transclude: true,
			replace: true,
			scope: {
				user: '@', // Sets the username
				minimal: '=?', // If set, minimal data will be shown
				limit: '=?', // The limit for the events to display
				
				// Each one of the following options
				// allow the user to hide or show the 
				// many sections in the template
				icon: '=?',
				date: '=?',
				heading: '=?',
				avatar: '=?',
				body: '=?',
			},
			controller: 'roGithubEventsCtrl',
		}
	})
	
	.directive('roGithubTransclude', function(githubEvents) {
		return {
			require: '^roGithubEvents',
			link: function(scope, iElem, iAttrs, ctrl) {
				scope.$watch(function() { return ctrl[iAttrs.roGithubTransclude]; }, function(element) {
					if (element) {
						iElem.html('');
						iElem.append(element);
					} else {
						iElem.html('');
						iElem.append(githubEvents.getLoader());
					}
				});
			}
		}
	})

	.directive('roGithubLoader', function ($templateCache){
		return {
			restrict: 'E',
			template: '',
			transclude: true,
			replace: true,
			require: '^roGithubEvents',
			link: function (scope, iElem, iAttrs, ctrl, transclude) {
				ctrl.setLoader(transclude(scope, function (){}));
			}
		}
	});