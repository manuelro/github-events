'use strict';

describe('Directive: roGithubEvents', function () {

  beforeEach(module('githubEvents.fake', 'githubEvents', 'githubEvents.directives', 'githubEvents.controllers'));

  var scope, compile, element, elementScope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  var compileTemplate = function (template){
      if(!template) template = '<ro-github-events></ro-github-events>';
      element = compile(template)(scope);
      scope.$apply();
      elementScope = element.scope();
  };

  beforeEach(function (){
      compileTemplate();
  });

  describe('roGithubEvents', function (){
    beforeEach(function (){
      compileTemplate();
    });

    it('should throw error if no username is present', function (){
      spyOn(elementScope, '$emit');

      // expect(elementScope.$emit).toHaveBeenCalled();
    });
  });

});
