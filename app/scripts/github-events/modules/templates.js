'use strict';
	
	// Templates
	angular.module('githubEvents.tpls', [
		'template/github-events/github-events.html',
	]);

	angular.module('template/github-events/github-events.html', [])
		.run(function ($templateCache){
			$templateCache.put('template/github-events/github-events.html', [
				'<ul class="media-list ro-github-events">',
					'<div class="ro-github-loader" ng-transclude ro-github-transclude="loader" ng-hide="eventsReady">{{loader}}</div>',
					'<li class="media ro-github-event ro-github-event-{{$index}}" ng-class-odd="\'odd\'" ng-class-even="\'even\'" ng-class="[{true:\'first\'}[$first], {true:\'middle\'}[$middle], {true:\'last\'}[$last]]" ng-repeat="event in events | orderBy: \'-created_at\' | limitTo:limit track by $index ">',
						'<div class="media-left ro-github-event-icon" ng-include="getTemplate(event.type, \'icon\')" ng-if="hasFeature(\'icon\')"></div>',
						'<div class="media-body ro-github-event-body-container">',
							'<div class="ro-github-event-date" ng-include="getTemplate(event.type, \'date\')" ng-if="hasFeature(\'date\')"></div>',
							'<div class="media-heading ro-github-event-heading" ng-include="getTemplate(event.type, \'heading\')" ng-if="hasFeature(\'heading\')"></div>',
							'<div class="media-left ro-github-event-avatar" ng-include="getTemplate(event.type, \'avatar\')" ng-if="hasFeature(\'avatar\')"></div>',
							'<div class="media-body ro-github-event-body" ng-include="getTemplate(event.type, \'body\')" ng-if="hasFeature(\'body\')"></div>',
						'</div>',
					'</li>',
				'</ul>',
			].join('\n'));
		});