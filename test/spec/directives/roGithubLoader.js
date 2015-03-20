'use strict';

describe('Directive: roGithubLoader', function () {

  beforeEach(module('githubEvents', 'githubEvents.directives'));

  var scope, compile, element, loader;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  var compileTemplate = function (template){
      if(!template) template = '<ro-github-events></ro-github-events>';
      element = compile(template)(scope);
      scope.$apply();
      loader = angular.element(element.children()[0]);
  };

  beforeEach(function (){
      compileTemplate();
  });

  describe('roGithubLoader', function (){
    beforeEach(function (){
      compileTemplate();
    });
    it('should replace the loading contents with transcluded contents', function (){
      compileTemplate('<ro-github-events><ro-github-loader>FooBar</ro-github-loader></ro-github-events>');
      expect(loader.text()).toBe('FooBar');
    });
  });

});
