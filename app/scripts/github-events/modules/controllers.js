'use strict';

	angular.module('githubEvents.controllers', [])
		.controller('roGithubEventsCtrl', function ($scope, $element, $attrs, $compile, githubEvents, $timeout){
				var self = this;
				// Gets user, firstly from the directive, 
				// and secondly from the provider config
				if(!angular.isDefined($scope.user)) $scope.user = githubEvents.getUser();
				// Sets default value for minimal option
				if(!angular.isDefined($scope.minimal)) $scope.minimal = false;
				// Sets default value for limit option
				if(!angular.isDefined($scope.limit)) $scope.limit = 30;
				// Sets default value for icon option,
				// is hidden by default
				if(!angular.isDefined($scope.icon)) $scope.icon = false;

				// Initializer for the events array
				$scope.events = [];
				// Helps the sections find out what template to use
				$scope.getTemplate = githubEvents.getTemplate;


				// Scope variable used to let the user know there has been an error
				$scope.error;
				$scope.eventsError = false;
				// Scope variable used to let the loader know when to hide
				$scope.eventsReady = false;
				// Sets the loader contents based on the directive contents
				self.setLoader = function (element){
					self.loader = element;
				}
				// Watches for the eventsReadyEvent event to be fired
				// and set the $scope.events properly
				$scope.$on('eventsReadyEvent', function (event, args){
					$scope.eventsReady = true;
					$scope.events = args;
				});
				// Watches for the eventsErrorEvent event to be fired
				// and set the $scope.eventsError properly
				$scope.$on('eventsErrorEvent', function (event, args){
					$scope.eventsError = true;
					$scope.error = args;
					self.setLoader($compile(githubEvents.getError())($scope));
				});
				// Helps the sections know if they are needed to display or not
				$scope.hasFeature = function (feature){
					var hasfeature;
					
					if($scope.minimal) {
						switch(feature){
							case 'date':
							case 'heading':
								hasfeature = angular.isDefined($scope[feature]) ? $scope[feature] : true;
								break;
							case 'icon':
							case 'avatar':
							case 'body':
								hasfeature = angular.isDefined($scope[feature]) ? $scope[feature] : false;
								break;
							default:
								hasfeature = angular.isDefined($scope[feature]) ? $scope[feature] : true;
								break;
						}
					} else {
						hasfeature = angular.isDefined($scope[feature]) ? $scope[feature] : true;
					}

					$scope[feature] = hasfeature;

					return hasfeature;
				}

				// The $resource service. Retrieves a list with the latest public events
				// and emits an event when ready
				githubEvents.events($scope.user).$promise.then(function (events, headers){
						$scope.$emit('eventsReadyEvent', events);
					}, function (error){
						$scope.$emit('eventsErrorEvent', error);
					});
		});	
