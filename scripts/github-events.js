/* global angular */

'use strict';

angular.module('yaru22.angular-timeago', [
]).directive('timeAgo', ['timeAgo', 'nowTime', function (timeAgo, nowTime) {
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      var fromTime;

      // Track the fromTime attribute
      attrs.$observe('fromTime', function (value) {
        fromTime = timeAgo.parse(value);
      });

      // Track changes to time difference
      scope.$watch(function () {
        return nowTime() - fromTime;
      }, function(value) {
        angular.element(elem).text(timeAgo.inWords(value));
      });
    }
  };
}]).factory('nowTime', ['$window', '$rootScope', function ($window, $rootScope) {
  var nowTime = Date.now();
  var updateTime = function() {
    $window.setTimeout(function() {
      $rootScope.$apply(function(){
        nowTime = Date.now();
        updateTime();
      });
    }, 1000);
  };
  updateTime();
  return function() {
    return nowTime;
  };
}]).factory('timeAgo', function () {
  var service = {};

  service.settings = {
    refreshMillis: 60000,
    allowFuture: false,
    strings: {
      'en_US': {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'ago',
        suffixFromNow: 'from now',
        seconds: 'less than a minute',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years',
        numbers: []
      },
      'de_DE': {
        prefixAgo: 'vor',
        prefixFromNow: null,
        suffixAgo: null,
        suffixFromNow: 'from now',
        seconds: 'weniger als einer Minute',
        minute: 'ca. einer Minute',
        minutes: '%d Minuten',
        hour: 'ca. einer Stunde',
        hours: 'ca. %d Stunden',
        day: 'einem Tag',
        days: '%d Tagen',
        month: 'ca. einem Monat',
        months: '%d Monaten',
        year: 'ca. einem Jahr',
        years: '%d Jahren',
        numbers: []
      },
      'he_IL': {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'לפני',
        suffixFromNow: 'מעכשיו',
        seconds: 'פחות מדקה',
        minute: 'כדקה',
        minutes: '%d דקות',
        hour: 'כשעה',
        hours: 'כ %d שעות',
        day: 'יום',
        days: '%d ימים',
        month: 'כחודש',
        months: '%d חודשים',
        year: 'כשנה',
        years: '%d שנים',
        numbers: []
      },
      'pt_BR': {
        prefixAgo: null,
        prefixFromNow: 'daqui a',
        suffixAgo: 'atrás',
        suffixFromNow: null,
        seconds: 'menos de um minuto',
        minute: 'cerca de um minuto',
        minutes: '%d minutos',
        hour: 'cerca de uma hora',
        hours: 'cerca de %d horas',
        day: 'um dia',
        days: '%d dias',
        month: 'cerca de um mês',
        months: '%d meses',
        year: 'cerca de um ano',
        years: '%d anos',
        numbers: []
      },
      'fr_FR': {
        prefixAgo: 'il y a',
        prefixFromNow: null,
        suffixAgo: null,
        suffixFromNow: 'from now',
        seconds: 'moins d\'une minute',
        minute: 'environ une minute',
        minutes: '%d minutes',
        hour: 'environ une heure',
        hours: 'environ %d heures',
        day: 'un jour',
        days: '%d jours',
        month: 'environ un mois',
        months: '%d mois',
        year: 'environ un an',
        years: '%d ans',
        numbers: []
      }
    }
  };

  service.inWords = function (distanceMillis) {
    var lang = document.documentElement.lang;
    var $l = service.settings.strings[lang];
    if (typeof $l === 'undefined') {
      $l = service.settings.strings['en_US'];
    }
    var prefix = $l.prefixAgo;
    var suffix = $l.suffixAgo;
    if (service.settings.allowFuture) {
      if (distanceMillis < 0) {
        prefix = $l.prefixFromNow;
        suffix = $l.suffixFromNow;
      }
    }

    var seconds = Math.abs(distanceMillis) / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    function substitute(stringOrFunction, number) {
      var string = angular.isFunction(stringOrFunction) ?
      stringOrFunction(number, distanceMillis) : stringOrFunction;
      var value = ($l.numbers && $l.numbers[number]) || number;
      return string.replace(/%d/i, value);
    }

    var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

    var separator = $l.wordSeparator === undefined ?  ' ' : $l.wordSeparator;
    if(lang === 'he_IL'){
      return [prefix, suffix, words].join(separator).trim();
    } else {
      return [prefix, words, suffix].join(separator).trim();
    }
  };

  service.parse = function (iso8601) {
    if (angular.isNumber(iso8601)) {
      return parseInt(iso8601, 10);
    }
    if (iso8601 instanceof Date){
      return iso8601;
    }
    var s = (iso8601 || '').trim();
    s = s.replace(/\.\d+/, ''); // remove milliseconds
    s = s.replace(/-/, '/').replace(/-/, '/');
    s = s.replace(/T/, ' ').replace(/Z/, ' UTC');
    s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
    return new Date(s);
  };

  return service;
}).filter('timeAgo', ['nowTime', 'timeAgo', function (nowTime, timeAgo) {
  return function (value) {
    var fromTime = timeAgo.parse(value);
    var diff = nowTime() - fromTime;
    return timeAgo.inWords(diff);
  };
}]);

'use strict';

	angular.module('githubEvents.controllers', [])
		.controller('roGithubEventsCtrl', ["$scope", "$element", "$attrs", "$compile", "githubEvents", "$timeout", function ($scope, $element, $attrs, $compile, githubEvents, $timeout){
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
		}]);	

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
	
	.directive('roGithubTransclude', ["githubEvents", function(githubEvents) {
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
	}])

	.directive('roGithubLoader', ["$templateCache", function ($templateCache){
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
	}]);
'use strict';

	angular.module('githubEvents.filters', [])
		.filter('roCleanUrl', function (){
			return function (input, type, args){
				var host = 'https://github.com';
				var result;
				
				result = input
					.replace(/\/\/api./g, '//')
					.replace(/\.com\/(users|repos)/g, '.com')
					.replace(/pulls\//g, 'pull/');

				return result;
			}
		})
		.filter('roMakeRef', function (){
			return function (input){
				var result = input
					.replace(/refs\/heads\//g, '');

				return result;
			}
		})
		.filter('roMakeUrl', ["roMakeRefFilter", "limitToFilter", function (roMakeRefFilter, limitToFilter){
			return function (input, type, args){
				var result;
				var host = 'https://github.com';
				var regPaths = {
					'default': '',
					repo: ':repo',
					tree: ':repo/tree/:branch',
					compare: ':repo/compare/:commits',
					tagZip: ':repo/archive/:tagName.zip'
				}

				if(args.branch) args.branch = roMakeRefFilter(args.branch);
				if(type=='compare' && args.commits) {
					if(args.commits.length - 2 == 2){
						args.commits = limitToFilter(args.commits[args.commits.length-2].sha, 10) + '...' + limitToFilter(args.commits[args.commits.length-1].sha, 10);
					} else {
						args.commits = limitToFilter(args.commits[0].sha, 10) + '...' + limitToFilter(args.commits[1].sha, 10);
					}
				}
					

				if(regPaths[type])
					result = [
							host,
							regPaths[type]
								.replace(/:[a-z0-9-_]+/gi, function(m){ return args[m.replace(':', '')]; })
						].join('/');

				return result;
			}
		}])
		.filter('roIgnoreAllAfterFirstNewLine', function (){
			return function (input){
				var result;

				result = input
					.replace(/\n(.)+/gim, '')
					.replace(/[\n\r]/gim, '');

				return result;
			}
		})
		.filter('roIgnoreAllAfterFirstDot', function (){
			return function (input){
				var result;

				result = input
					.replace(/\.\s+(.)+/gim, '')
					.replace(/[\n\r]/gim, '');

				return result + '.';
			}
		});



'use strict';
	

	// Providers
	var GithubEventsProvider = function (){
		var username = '';
		var loader = '<b>Loading Github Events...</b>';
		var error = [
			'<h4>GithubEvents: Something went wrong, please review your configuration.</h4>',
			'<p>',
				'<b>Message:</b> <mark>{{error.message | roIgnoreAllAfterFirstNewLine}}</mark>',
				'<ul>',
					'<li>Make sure the profile you are trying to access is currently active</li>',
					'<li>Make sure the privacy settings are allowing public events to be accessible</li>',
					'<li>Make sure your Internet connection is active</li>',
					'<li>If the issue persists you can ask for some advice in the forum or submit an issue</li>',
				'</ul><br>',
				'<small>You can customize this error message during the configuration phase of your application by using:<br> <code>githubEventsProvider.error(\"You custom message\")</code><br><br> See the GithubEvents project page for further reading.<small>',
			'</p>'
		].join('\n');

		this.username = function (value) {
			username = value;
			return this;
		}

		this.template = function (template, section, value) {
			if(templates[template]) {
				if(angular.isObject(section)){
					angular.forEach(section, function (value, key){
						templates[template][key] = value;
					});
				} else {
					templates[template][section] = value;
				}
			}
			return this;
		}

		this.loader = function (value){
			loader = '<b>loader</b>'.replace('loader', value);
			return this;
		}

		this.error = function (value){
			error = value;
			return this;
		}

		var sections = ['icon', 'date', 'heading', 'avatar', 'body'];
		
		var templatesNameSpace = 'templates/github-events';
		
		var defaultTpl = {
			icon: '',
			date: '<small>{{event.created_at | timeAgo}}</small>',
			heading: [
				'<h4>',
					'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a>',
					'{{event.payload.action}}',
					'<a href="{{event.repo.url | roCleanUrl}}">{{event.repo.full_name}}</a>',
				'</h4>'
			].join('\n'),
			avatar: [
				'<a href="{{event.actor.url | roCleanUrl}}">',
					'<img ng-src="{{event.actor.avatar_url}}?v=3&s=30" alt="{{event.actor.login}}">',
				'</a>'
			].join('\n'),
			body: '<p>{{event.type}}</p>',
			empty: '',
		}

		var templates = {
			'default': defaultTpl,
			CommitCommentEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'commented on commit <a href="{{event.payload.comment.html_url}}">{{event.repo.name}}@{{event.payload.comment.commit_id | limitTo:10}}</a>',
					'</h4>',
				].join('\n'),
				body: '<p>{{event.payload.comment.body | roIgnoreAllAfterFirstNewLine | roIgnoreAllAfterFirstDot}}</p>',
			},
			CreateEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> created {{event.payload.ref_type}} ',
						'<span ng-if="event.payload.ref_type == \'tag\'">',
							'<mark>',
								'<a href="{{ \'\' | roMakeUrl:\'tree\':{repo:event.repo.name, branch:event.payload.ref} }}">{{event.payload.ref | roMakeRef}}</a>',
							' </mark> at',
						'</span>',
						' <a href="{{ \'\' | roMakeUrl:\'repo\':{repo:event.repo.name} }}">{{event.repo.name}}</a> ',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
			/*CreateEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> created {{event.payload.ref_type}} ',
						'<mark>',
							'<a href="{{ \'\' | roMakeUrl:\'tree\':{repo:event.repo.name, branch:event.payload.ref} }}">{{event.payload.ref | roMakeRef}}</a>',
						' </mark>',
						'at <a href="{{ \'\' | roMakeUrl:\'repo\':{repo:event.repo.name} }}">{{event.repo.name}}</a> ',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},*/
			DeleteEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> deleted {{event.payload.ref_type}} ',
						'{{event.payload.ref}}',
						'at <a href="{{ \'\' | roMakeUrl:\'repo\':{repo:event.repo.name} }}">{{event.repo.name}}</a> ',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
			DeploymentEvent: defaultTpl,
			DeploymentStatusEvent: defaultTpl,
			DownloadEvent: defaultTpl,
			FollowEvent: defaultTpl,
			ForkEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> forked ',
						'<a href="{{ event.repo.url | roCleanUrl }}">{{event.repo.name}}</a> ',
						'at <a href="{{event.payload.forkee.html_url}}">{{event.payload.forkee.full_name}}</a> ',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
			ForkApplyEvent: defaultTpl,
			GistEvent: defaultTpl,
			GollumEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'{{event.payload.pages[0].action}} the <a href="{{event.repo.url | roCleanUrl}}">{{event.repo.name}}</a> wiki',
					'</h4>',
				].join('\n'),
				body: '<p ng-repeat="page in event.payload.pages">{{page.action}} <a href="{{page.html_url}}">{{page.title}}</a>.</p>',
			},
			IssueCommentEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'commented on issue <a href="{{event.payload.issue.html_url}}">{{event.repo.name}}#{{event.payload.issue.number}}</a>',
					'</h4>',
				].join('\n'),
				body: '<p>{{event.payload.comment.body | roIgnoreAllAfterFirstNewLine }}</p>',
			},
			IssuesEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'{{event.payload.action}} issue ',
						'<a href="{{ event.payload.issue.html_url }}">{{ event.repo.name }}#{{event.payload.issue.number}}</a> ',
					'</h4>',
				].join('\n'),
				body: [
					'<p>{{event.payload.issue.title}}</p>'
				].join('\n'),
			},
			MemberEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> added ',
						'<a href="{{ event.payload.user.url | roCleanUrl }}">{{event.payload.user.login}}</a> ',
						'to <a href="{{event.repo.url | roCleanUrl}}">{{event.repo.name}}</a> ',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
			MembershipEvent: defaultTpl,
			PageBuildEvent: defaultTpl,
			PublicEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> has made ',
						'<a href="{{event.repo.url | roCleanUrl}}">{{event.repo.name}}</a> public',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
			PullRequestEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'{{event.payload.action}} pull request ',
						'<a href="{{ event.payload.pull_request.url | roCleanUrl }}">{{ event.repo.name }}#{{event.payload.pull_request.number}}</a> ',
					'</h4>',
				].join('\n'),
				body: [
					'<p>',
						'{{event.payload.pull_request.title}} <br>',
					'</p>',
					'<p>',
						'<mark>',
							'{{event.payload.pull_request.commits | number}} {{  {true:\'commit\', false:\'commits\'}[event.payload.pull_request.commits==1]  }} with',
							'{{event.payload.pull_request.additions | number}} {{  {true:\'addition\', false:\'additions\'}[event.payload.pull_request.additions==1]  }} and',
							'{{event.payload.pull_request.deletions | number}} {{  {true:\'deletions\', false:\'deletions\'}[event.payload.pull_request.deletions==1]  }}',
						'</mark>',
					'</p>',
				].join('\n'),
			},
			PullRequestReviewCommentEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'commented on a pull request ',
						'<a href="{{ event.payload.comment.html_url }}">{{ event.repo.name }}#{{event.payload.pull_request.number}}</a> ',
					'</h4>',
				].join('\n'),
				body: [
					'<p>{{event.payload.comment.body | roIgnoreAllAfterFirstDot}}</p>'
				].join('\n'),
			},
			PushEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'pushed to <a href="{{\'\' | roMakeUrl:\'tree\':{repo:event.repo.name, branch:event.payload.ref} }}">{{  event.payload.ref | roMakeRef }}</a> ',
						'at <a href="{{event.repo.url | roCleanUrl}}">{{event.repo.name}}</a>',
					'</h4>',
				].join('\n'),
				body: [
					'<p class="commit commit-{{$index}}" ng-repeat="commit in event.payload.commits | limitTo:2" ng-class-odd="\'odd\'" ng-class-even="\'even\'" ng-class="[{true:\'first\'}[$first], {true:\'middle\'}[$middle], {true:\'last\'}[$last]]">',
						'<img ng-src="{{event.actor.avatar_url}}?v=3&s=16" alt="{{event.actor.login}}"> ',
						'<code><a href="{{commit.url | roCleanUrl}}">{{commit.sha | limitTo:7}}</a></code> {{commit.message | roIgnoreAllAfterFirstNewLine }}', 
					'</p>',
					'<small ng-if="event.payload.commits.length - 2 == 2">',
						'<a href="{{ \'\' | roMakeUrl:\'compare\':{repo:event.repo.name, commits:event.payload.commits } }}">{{event.payload.commits.length - 2}} more commits »</a>',
					'</small>',
					'<small ng-if="event.payload.commits.length == 2">',
						'<a href="{{ \'\' | roMakeUrl:\'compare\':{repo:event.repo.name, commits:event.payload.commits } }}">View comparison for these 2 commits »</a>',
					'</small>'
				].join('\n'),
			},
			ReleaseEvent: {
				heading: [
					'<h4>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> ',
						'released <a href="{{ event.payload.release.html_url }}">{{  event.payload.release.name }}</a> ',
						'at <a href="{{event.repo.url | roCleanUrl}}">{{event.repo.name}}</a>',
					'</h4>',
				].join('\n'),
				body: [
					'<p>',
						'<a href="{{\'\' | roMakeUrl:\'tagZip\':{repo:event.repo.name, tagName:event.payload.release.tag_name} }}">Source code (zip)</a>', 
					'</p>',
				].join('\n'),
			},
			RepositoryEvent: defaultTpl,
			StatusEvent: defaultTpl,
			TeamAddEvent: defaultTpl,
			WatchEvent: {
				heading: [
					'<small>',
						'<a href="{{event.actor.url | roCleanUrl}}">{{event.actor.login}}</a> starred ',
						'<a href="{{ event.repo.url | roCleanUrl }}">{{event.repo.name}}</a>',
						'{{event.created_at | timeAgo}}',
					'<small>'
				].join('\n'),
				date: ' ',
				body: ' ',
				avatar: ' ',
			},
		}

		this.$get = ["$resource", "$templateCache", function ($resource, $templateCache){
			var Events = $resource('https://api.github.com/users/:username/events/public', null, {cache:true});

			angular.forEach(templates, function (tplValue, tplKey) {
				angular.forEach(tplValue, function (sectionValue, sectionKey){
					var path, url;
						
					path = templatesNameSpace+'/type-section.html';
					url = path
						.replace('type', tplKey)
						.replace('section', sectionKey);

					$templateCache.put(url, sectionValue);
				});
			});

			return {
				// Github API Services
				events: function (username){
					return 	Events.query({username:username}); 
				},

				// Gets
				getUser: function (){
					return username;
				},
				getTemplate: function (type, section){
					if(!templates[type] || templates[type] && !templates[type][section]) {
						type = 'default';
						if(!templates[type][section])
							section = 'empty';
					}
					
					var path = templatesNameSpace+'/type-section.html';
					var url = path
						.replace('type', type)
						.replace('section', section);

					return url;
				},
				getLoader: function (){
					return loader;
				},
				getError: function (){
					return error;
				}
			}

		}]
	}
	/**
        * @ngdoc overview
        * @name githubEvents.provider:githubEventsProvider
        * @requires chem.components.button
        * @description 
        * The chem.components module is a collection of AngularJS directives for 
        * rapidly generate the DOM structure for Bootstrap Components.
        * This module makes use of {@link http://angular-ui.github.io/bootstrap ui.bootstrap}.
        *
        *
        * ##External Dependencies
        * {@link http://angular-ui.github.io/bootstrap ui.bootstrap}
        * 
        * ##Installation
        * There are may ways to install chem.components in your project.
        * ###Installing using Bower
        * You can use {@link http://bower.io Bower} to load chem.components into your project dependencies:
        * >`bower install chem.components --save`  	
        *
        * ###Installing using Npm
        * You can use {@link http://bower.io Npm} to load chem.components into your project dependencies:
        * >`npm install chem.components --save`
    **/
	angular.module('githubEvents.providers', [])
		.provider('githubEvents', GithubEventsProvider);

'use strict';
	
	// Templates
	angular.module('githubEvents.tpls', [
		'template/github-events/github-events.html',
	]);

	angular.module('template/github-events/github-events.html', [])
		.run(["$templateCache", function ($templateCache){
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
		}]);
'use strict';
	

	angular.module('githubEvents', [
		'ngResource', 
		'yaru22.angular-timeago', 
		'githubEvents.providers', 
		'githubEvents.tpls', 
		'githubEvents.filters', 
		'githubEvents.controllers',
		'githubEvents.directives', 
	]);