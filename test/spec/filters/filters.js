'use strict';

describe('Filter:', function () {

  beforeEach(module('githubEvents.filters'));

  var scope, interpolate, filter;

  beforeEach(inject(function ($rootScope, $interpolate) {
    scope = $rootScope.$new();
    interpolate = $interpolate;
  }));

  describe('roCleanUrlFilter', function (){
    var url, expected;

    beforeEach(inject(function (roCleanUrlFilter){
      filter = roCleanUrlFilter;
    }));

    it('should remove "users" prefix', function () {
      url = 'https://github.com/users/manuelro';
      expected = 'https://github.com/manuelro';

      expect(filter(url)).toBe(expected);
    });
    it('should remove "repos" prefix', function () {
      url = 'https://github.com/repos/foo/bar';
      expected = 'https://github.com/foo/bar';

      expect(filter(url)).toBe(expected);
    });
    it('should singlefy "pulls"', function () {
      url = 'https://github.com/repos/foo/bar/pulls/baz/bez';
      expected = 'https://github.com/foo/bar/pull/baz/bez';

      expect(filter(url)).toBe(expected);
    });
  });

  describe('roMakeRefFilter', function (){
    var ref, expected;

    beforeEach(inject(function (roMakeRefFilter){
      filter = roMakeRefFilter;
    }));

    it('should "refs/heads" from reference name', function () {
      ref = 'refs/heads/manuelro/foo-bar';
      expected = 'manuelro/foo-bar';

      expect(filter(ref)).toBe(expected);
    });
  });

  describe('roMakeUrlFilter', function (){
    var type, args, expected;

    beforeEach(inject(function (roMakeUrlFilter){
      filter = roMakeUrlFilter;
    }));

    it('should create "repo" url', function () {
      type = 'repo';
      args = {repo:'user-foo/repo-bar'};
      expected = 'https://github.com/user-foo/repo-bar';

      expect(filter('', type, args)).toBe(expected);
    });

    it('should create "tree" url', function () {
      type = 'tree';
      args = {repo:'user-foo/repo-bar', branch:'master'};
      expected = 'https://github.com/user-foo/repo-bar/tree/master';

      expect(filter('', type, args)).toBe(expected);
    });

    it('should create "tagZip" url', function () {
      type = 'tagZip';
      args = {repo:'user-foo/repo-bar', tagName:'0.1.0'};
      expected = 'https://github.com/user-foo/repo-bar/archive/0.1.0.zip';

      expect(filter('', type, args)).toBe(expected);
    });

    it('should create "compare" url', function () {
      type = 'compare';
      args = {repo:'user-foo/repo-bar', commits:[{sha:10000000009}, {sha:10000000009}]};
      expected = 'https://github.com/user-foo/repo-bar/compare/1000000000...1000000000';

      expect(filter('', type, args)).toBe(expected);
    });
  });

  describe('roIgnoreAllAfterFirstNewLineFilter', function (){
    var text, expected;

    beforeEach(inject(function (roIgnoreAllAfterFirstNewLineFilter){
      filter = roIgnoreAllAfterFirstNewLineFilter;
    }));

    it('should remove everything after first new line', function () {
      text = 'foo\nbar\nbez';
      expected = 'foo';

      expect(filter(text)).toBe(expected);
    });
  });

  describe('roIgnoreAllAfterFirstDotFilter', function (){
    var text, expected;

    beforeEach(inject(function (roIgnoreAllAfterFirstDotFilter){
      filter = roIgnoreAllAfterFirstDotFilter;
    }));

    it('should remove everything after first dot', function () {
      text = 'Foo. Bar bez. Bez, biz.';
      expected = 'Foo';

      expect(filter(text)).toBe(expected);
    });
  });
  
});
