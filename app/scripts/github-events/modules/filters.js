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
		.filter('roMakeUrl', function (roMakeRefFilter, limitToFilter){
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
		})
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


