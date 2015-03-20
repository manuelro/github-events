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

		this.$get = function ($resource, $templateCache){
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

		}
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
