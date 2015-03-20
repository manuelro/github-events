'use strict';

describe('Directive: roGithubController', function () {

  beforeEach(module('githubEvents'));

  var $controller, $rootScope, $scope, $httpBackend, controller;

  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    $scope = $rootScope.$new();
    controller = $controller('roGithubEventsCtrl', {$scope: $scope, $element:{}, $attrs:{}});
  }));

  describe('getTemplate',function (){
    var eventType, eventSection, eventTpl;

    it('should return section template url of event type', function (){
      eventType = 'IssuesEvent';
      eventSection = 'heading';
      eventTpl = $scope.getTemplate(eventType, eventSection);
      
      expect(eventTpl).toContain(eventType);
      expect(eventTpl).toContain(eventSection);
    });

    it('should return default-empty template url if either type or section does not match the available templates', function (){
      eventType = 'FooBar';
      eventSection = 'BazBez';
      eventTpl = $scope.getTemplate(eventType, eventSection);

      expect(eventTpl).not.toContain(eventType);
      expect(eventTpl).not.toContain(eventSection);

      expect(eventTpl).toContain('default');
      expect(eventTpl).toContain('empty');
    });
  });

  describe('hasFeature', function(){
    it('should set minimal sections to be displayed', function (){
      $scope.minimal = true;
      controller = $controller('roGithubEventsCtrl', {$scope: $scope, $element:{}, $attrs:{}});

      expect($scope.hasFeature('icon')).toBeFalsy();
      expect($scope.hasFeature('date')).toBeTruthy();
      expect($scope.hasFeature('heading')).toBeTruthy();
      expect($scope.hasFeature('avatar')).toBeFalsy();
      expect($scope.hasFeature('body')).toBeFalsy();
    });

    it('should set feature to true even if minimal is set to true', function (){
      $scope.minimal = true;
      $scope.icon = true;
      controller = $controller('roGithubEventsCtrl', {$scope: $scope, $element:{}, $attrs:{}});

      expect($scope.hasFeature('icon')).toBeTruthy();
    });

    it('should set feature', function (){
      $scope.icon = true;
      controller = $controller('roGithubEventsCtrl', {$scope: $scope, $element:{}, $attrs:{}});

      expect($scope.hasFeature('icon')).toBeTruthy();
    });
  });

});
