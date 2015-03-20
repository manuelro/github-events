'use strict';
	

	angular.module('app', [
		'githubEvents', 
		'ngMockE2E',
		'githubEvents.fake'
	])
	.config(function (githubEventsProvider){
		githubEventsProvider
			.username('manuelro')
			.template('PushEvent', {})
			.error('My custom error');
	})
	.run(function ($httpBackend, fakeEvents) {

		$httpBackend.whenGET('https://api.github.com/users/manuelro/events/public').respond(fakeEvents);

		// Authorization for views
		$httpBackend.whenGET(/^(views|template|fake)\//).passThrough();
	});